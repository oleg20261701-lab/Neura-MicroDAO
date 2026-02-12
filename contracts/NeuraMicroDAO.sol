// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title NeuraMicroDAO
 * @notice A MicroDAO Treasury using native ANKR on Neura testnet
 * @dev Single file, no imports, no OpenZeppelin
 */
contract NeuraMicroDAO {
    // ============ State Variables ============
    
    address public owner;
    bool public paused;
    bool private locked;
    
    // Treasury accounting
    uint256 public totalDeposits;
    uint256 public totalLocked;
    
    // Parameters
    uint256 public minDepositToVote;
    uint256 public proposalCreateMin;
    uint256 public quorumBps;
    uint256 public minVotingDuration;
    uint256 public maxVotingDuration;
    
    // Member balances
    mapping(address => uint256) public memberBalance;
    
    // Proposal counter
    uint256 public proposalCount;
    
    // Proposal states
    enum ProposalState { Active, Passed, Failed, Executed }
    
    // Proposal storage - split to avoid stack too deep
    struct ProposalCore {
        uint256 id;
        address creator;
        address recipient;
        uint256 amount;
        ProposalState state;
        uint256 endTime;
    }
    
    struct ProposalText {
        string title;
        string description;
    }
    
    struct ProposalVotes {
        uint256 yesWeight;
        uint256 noWeight;
        uint256 totalWeight;
    }
    
    mapping(uint256 => ProposalCore) public proposalCores;
    mapping(uint256 => ProposalText) public proposalTexts;
    mapping(uint256 => ProposalVotes) public proposalVotes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // ============ Events ============
    
    event Deposit(address indexed member, uint256 amount);
    event Withdraw(address indexed member, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, address recipient, uint256 amount);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalFinalized(uint256 indexed proposalId, ProposalState state);
    event ProposalExecuted(uint256 indexed proposalId, address recipient, uint256 amount);
    event ParamsUpdated(uint256 minDepositToVote, uint256 proposalCreateMin, uint256 quorumBps);
    event Paused(bool isPaused);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }
    
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
        minDepositToVote = 0.01 ether;
        proposalCreateMin = 0.1 ether;
        quorumBps = 1000; // 10%
        minVotingDuration = 1 hours;
        maxVotingDuration = 7 days;
    }
    
    // ============ Treasury Functions ============
    
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Zero deposit");
        
        memberBalance[msg.sender] += msg.value;
        totalDeposits += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Zero amount");
        require(memberBalance[msg.sender] >= amount, "Insufficient balance");
        require(totalAvailable() >= amount, "Insufficient available");
        
        memberBalance[msg.sender] -= amount;
        totalDeposits -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }
    
    function totalAvailable() public view returns (uint256) {
        if (totalDeposits <= totalLocked) return 0;
        return totalDeposits - totalLocked;
    }
    
    // ============ Proposal Functions ============
    
    function createProposal(
        string calldata title,
        string calldata description,
        address recipient,
        uint256 amount,
        uint256 votingDuration
    ) external whenNotPaused returns (uint256) {
        require(memberBalance[msg.sender] >= proposalCreateMin, "Insufficient deposit");
        require(recipient != address(0), "Zero recipient");
        require(amount > 0, "Zero amount");
        require(bytes(title).length <= 80, "Title too long");
        require(bytes(description).length <= 500, "Description too long");
        require(votingDuration >= minVotingDuration, "Duration too short");
        require(votingDuration <= maxVotingDuration, "Duration too long");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        proposalCores[proposalId] = ProposalCore({
            id: proposalId,
            creator: msg.sender,
            recipient: recipient,
            amount: amount,
            state: ProposalState.Active,
            endTime: block.timestamp + votingDuration
        });
        
        proposalTexts[proposalId] = ProposalText({
            title: title,
            description: description
        });
        
        proposalVotes[proposalId] = ProposalVotes({
            yesWeight: 0,
            noWeight: 0,
            totalWeight: 0
        });
        
        emit ProposalCreated(proposalId, msg.sender, recipient, amount);
        
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external whenNotPaused {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        require(canVote(msg.sender), "Cannot vote");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        ProposalCore storage core = proposalCores[proposalId];
        require(core.state == ProposalState.Active, "Not active");
        require(block.timestamp < core.endTime, "Voting ended");
        
        uint256 weight = memberBalance[msg.sender];
        hasVoted[proposalId][msg.sender] = true;
        
        ProposalVotes storage votes = proposalVotes[proposalId];
        if (support) {
            votes.yesWeight += weight;
        } else {
            votes.noWeight += weight;
        }
        votes.totalWeight += weight;
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }
    
    function finalize(uint256 proposalId) external whenNotPaused {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        
        ProposalCore storage core = proposalCores[proposalId];
        require(core.state == ProposalState.Active, "Not active");
        require(block.timestamp >= core.endTime, "Voting not ended");
        
        ProposalVotes storage votes = proposalVotes[proposalId];
        
        uint256 quorumRequired = (totalDeposits * quorumBps) / 10000;
        bool quorumMet = votes.totalWeight >= quorumRequired;
        bool passed = quorumMet && votes.yesWeight > votes.noWeight;
        
        if (passed) {
            core.state = ProposalState.Passed;
            totalLocked += core.amount;
        } else {
            core.state = ProposalState.Failed;
        }
        
        emit ProposalFinalized(proposalId, core.state);
    }
    
    function execute(uint256 proposalId) external nonReentrant whenNotPaused {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        
        ProposalCore storage core = proposalCores[proposalId];
        require(core.state == ProposalState.Passed, "Not passed");
        require(address(this).balance >= core.amount, "Insufficient balance");
        
        core.state = ProposalState.Executed;
        totalLocked -= core.amount;
        totalDeposits -= core.amount;
        
        (bool success, ) = payable(core.recipient).call{value: core.amount}("");
        require(success, "Transfer failed");
        
        emit ProposalExecuted(proposalId, core.recipient, core.amount);
    }
    
    // ============ View Functions ============
    
    function getProposalCore(uint256 proposalId) external view returns (
        uint256 id,
        address creator,
        address recipient,
        uint256 amount,
        ProposalState state,
        uint256 endTime
    ) {
        ProposalCore storage core = proposalCores[proposalId];
        return (core.id, core.creator, core.recipient, core.amount, core.state, core.endTime);
    }
    
    function getProposalText(uint256 proposalId) external view returns (
        string memory title,
        string memory description
    ) {
        ProposalText storage text = proposalTexts[proposalId];
        return (text.title, text.description);
    }
    
    function getProposalVotes(uint256 proposalId) external view returns (
        uint256 yesWeight,
        uint256 noWeight,
        uint256 totalWeight
    ) {
        ProposalVotes storage votes = proposalVotes[proposalId];
        return (votes.yesWeight, votes.noWeight, votes.totalWeight);
    }
    
    function getTreasuryStats() external view returns (
        uint256 deposits,
        uint256 available
    ) {
        return (totalDeposits, totalAvailable());
    }
    
    function isMember(address account) public view returns (bool) {
        return memberBalance[account] > 0;
    }
    
    function canVote(address account) public view returns (bool) {
        return memberBalance[account] >= minDepositToVote;
    }
    
    function canCreateProposal(address account) public view returns (bool) {
        return memberBalance[account] >= proposalCreateMin;
    }
    
    // ============ Admin Functions ============
    
    function setParams(
        uint256 _minDepositToVote,
        uint256 _proposalCreateMin,
        uint256 _quorumBps,
        uint256 _minVotingDuration,
        uint256 _maxVotingDuration
    ) external onlyOwner {
        require(_quorumBps <= 10000, "Invalid quorum");
        require(_minVotingDuration <= _maxVotingDuration, "Invalid duration");
        
        minDepositToVote = _minDepositToVote;
        proposalCreateMin = _proposalCreateMin;
        quorumBps = _quorumBps;
        minVotingDuration = _minVotingDuration;
        maxVotingDuration = _maxVotingDuration;
        
        emit ParamsUpdated(_minDepositToVote, _proposalCreateMin, _quorumBps);
    }
    
    function pause() external onlyOwner {
        paused = true;
        emit Paused(true);
    }
    
    function unpause() external onlyOwner {
        paused = false;
        emit Paused(false);
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }
    
    // ============ Receive ============
    
    receive() external payable {
        memberBalance[msg.sender] += msg.value;
        totalDeposits += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}

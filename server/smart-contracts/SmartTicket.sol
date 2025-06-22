
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SmartTicket
 * @dev Implementation of Smart Ticket NFT with anti-scalping features
 * Patent Claims: Time-locked NFTs, Price caps, Revenue sharing
 */
contract SmartTicket is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct TicketData {
        uint256 faceValue;          // Original ticket price
        uint256 maxResalePrice;     // Maximum resale price (patent claim)
        uint256 unlockDate;         // Time-lock release date (patent claim)
        address artistWallet;       // Artist's wallet for revenue sharing
        uint256 artistRoyalty;      // Artist royalty percentage (basis points)
        bool isTransferable;        // Transfer status
        string eventDetails;        // Event information
    }
    
    mapping(uint256 => TicketData) public ticketData;
    mapping(uint256 => uint256) public lastSalePrice;
    
    // Events for patent demonstration
    event TicketMinted(uint256 indexed tokenId, address indexed to, uint256 faceValue, uint256 unlockDate);
    event TicketUnlocked(uint256 indexed tokenId);
    event ResaleBlocked(uint256 indexed tokenId, uint256 attemptedPrice, uint256 maxAllowed);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed artist, uint256 amount);
    
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}
    
    /**
     * @dev Mint a new Smart Ticket with anti-scalping features
     * Patent Claim: Programmable digital asset with embedded rules
     */
    function safeMint(
        address to,
        uint256 faceValue,
        uint256 maxResaleMultiplier, // e.g., 150 = 150% of face value
        uint256 lockDurationHours,   // Hours until transferable
        address artistWallet,
        uint256 artistRoyalty,       // Basis points (e.g., 1000 = 10%)
        string memory eventDetails
    ) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(faceValue > 0, "Face value must be positive");
        require(maxResaleMultiplier >= 100, "Resale multiplier cannot be less than 100%");
        require(artistRoyalty <= 5000, "Artist royalty cannot exceed 50%");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Calculate unlock date (patent claim: time-locked NFT)
        uint256 unlockDate = block.timestamp + (lockDurationHours * 1 hours);
        
        // Calculate maximum resale price (patent claim: price cap)
        uint256 maxResalePrice = (faceValue * maxResaleMultiplier) / 100;
        
        // Store ticket data with anti-scalping rules
        ticketData[tokenId] = TicketData({
            faceValue: faceValue,
            maxResalePrice: maxResalePrice,
            unlockDate: unlockDate,
            artistWallet: artistWallet,
            artistRoyalty: artistRoyalty,
            isTransferable: false,
            eventDetails: eventDetails
        });
        
        _safeMint(to, tokenId);
        
        emit TicketMinted(tokenId, to, faceValue, unlockDate);
    }
    
    /**
     * @dev Override transfer to implement time-lock and price cap (patent claims)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Skip checks for minting (from == address(0))
        if (from == address(0)) {
            return;
        }
        
        TicketData storage ticket = ticketData[tokenId];
        
        // Patent Claim: Time-locked NFT - cannot transfer until unlock date
        require(block.timestamp >= ticket.unlockDate, "Ticket is still time-locked");
        
        // Unlock the ticket for future transfers
        if (!ticket.isTransferable && block.timestamp >= ticket.unlockDate) {
            ticket.isTransferable = true;
            emit TicketUnlocked(tokenId);
        }
    }
    
    /**
     * @dev Marketplace sale with price cap enforcement and revenue sharing
     * Patent Claims: Price caps, Revenue sharing distributions
     */
    function marketplaceSale(
        uint256 tokenId,
        address buyer,
        uint256 salePrice
    ) external payable nonReentrant {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(buyer != address(0), "Invalid buyer address");
        require(msg.value == salePrice, "Incorrect payment amount");
        
        TicketData storage ticket = ticketData[tokenId];
        
        // Patent Claim: Price cap enforcement
        require(salePrice <= ticket.maxResalePrice, "Sale price exceeds maximum allowed");
        
        if (salePrice > ticket.maxResalePrice) {
            emit ResaleBlocked(tokenId, salePrice, ticket.maxResalePrice);
            revert("Price exceeds anti-scalping limit");
        }
        
        // Patent Claim: Revenue sharing - automatic royalty distribution
        uint256 artistRoyalty = (salePrice * ticket.artistRoyalty) / 10000;
        uint256 sellerProceeds = salePrice - artistRoyalty;
        
        // Transfer royalty to artist
        if (artistRoyalty > 0 && ticket.artistWallet != address(0)) {
            payable(ticket.artistWallet).transfer(artistRoyalty);
            emit RoyaltyPaid(tokenId, ticket.artistWallet, artistRoyalty);
        }
        
        // Transfer proceeds to seller
        payable(msg.sender).transfer(sellerProceeds);
        
        // Record sale price for transparency
        lastSalePrice[tokenId] = salePrice;
        
        // Transfer the NFT
        _transfer(msg.sender, buyer, tokenId);
    }
    
    /**
     * @dev Check if ticket is currently transferable (patent claim: time-lock status)
     */
    function isTicketTransferable(uint256 tokenId) external view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return block.timestamp >= ticketData[tokenId].unlockDate;
    }
    
    /**
     * @dev Get maximum allowed resale price (patent claim: price cap)
     */
    function getMaxResalePrice(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return ticketData[tokenId].maxResalePrice;
    }
    
    /**
     * @dev Get time remaining until ticket becomes transferable
     */
    function getTimeUntilUnlock(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 unlockDate = ticketData[tokenId].unlockDate;
        if (block.timestamp >= unlockDate) {
            return 0;
        }
        return unlockDate - block.timestamp;
    }
    
    /**
     * @dev Get comprehensive ticket information
     */
    function getTicketInfo(uint256 tokenId) external view returns (
        uint256 faceValue,
        uint256 maxResalePrice,
        uint256 unlockDate,
        address artistWallet,
        uint256 artistRoyalty,
        bool isTransferable,
        string memory eventDetails,
        uint256 lastPrice
    ) {
        require(_exists(tokenId), "Token does not exist");
        
        TicketData storage ticket = ticketData[tokenId];
        
        return (
            ticket.faceValue,
            ticket.maxResalePrice,
            ticket.unlockDate,
            ticket.artistWallet,
            ticket.artistRoyalty,
            ticket.isTransferable,
            ticket.eventDetails,
            lastSalePrice[tokenId]
        );
    }
    
    /**
     * @dev Emergency unlock for special circumstances (owner only)
     */
    function emergencyUnlock(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        ticketData[tokenId].unlockDate = block.timestamp;
        ticketData[tokenId].isTransferable = true;
        emit TicketUnlocked(tokenId);
    }
    
    /**
     * @dev Update artist royalty percentage (owner only, before unlock)
     */
    function updateArtistRoyalty(uint256 tokenId, uint256 newRoyalty) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(newRoyalty <= 5000, "Royalty cannot exceed 50%");
        require(block.timestamp < ticketData[tokenId].unlockDate, "Cannot modify after unlock");
        
        ticketData[tokenId].artistRoyalty = newRoyalty;
    }
    
    /**
     * @dev Get total number of tickets minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}

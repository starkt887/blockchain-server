// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Certificationv1 is ERC721URIStorage, ERC721Holder {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    struct Token_structure {
        address tokenCreator;
        uint256 tokenID;
        string data;

    }

    mapping(uint256 => Token_structure) token_List;

    event MintCertificateEvent(
        uint256 date,
        address indexed from,
        address indexed owner,
        uint256 indexed tokenid,
        string data
    );
    event DataUriSetEvent(
        uint256 date,
        address indexed from,
        uint256 indexed tokenid,
        string tkuri
    );

    event TransferDataEvent(
        uint256 indexed date,
        uint256 indexed tokenid,
        address from,
        address to
    );
    event ApproveOwnerEvent(
          uint256 indexed date,
        uint256 indexed tokenid,
        address from,
        address to
    );
     event ApproveAnyoneEvent(
          uint256 indexed date,
        uint256 indexed tokenid,
        address from,
        address to
    );
    
    address Admin;
    address SuperAdmin;

    constructor(
        string memory title,
        string memory symbol,
        address admin,
        address superadmin
    ) ERC721(title, symbol) {
        Admin = admin;
        SuperAdmin = superadmin;

        //setApprovalForAll(SuperAdmin, true);
        //setApprovalForAll(SuperAdmin, true);
    }


    function adminOf() external view returns (address) {
        return Admin;
    }

    function getTokens(uint256 id)
        external
        view
        returns (Token_structure memory)
    {
        return (token_List[id]);
    }

    function mint_nemwNFT(address to, string memory tkuri) external {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId); //msg.sender is the factory contract instance adddress
        _setTokenURI(newItemId, tkuri);

        //require(msg.sender==Admin,"Admin can only approve the token");
        //approve(address(this), newItemId);//give approval to contract to transfer this token to other

        token_List[newItemId].tokenCreator = Admin;
        token_List[newItemId].tokenID = newItemId;
        token_List[newItemId].data = tkuri;
        approve(address(this), newItemId);
        if (address(to) != address(0)) {
            safeTransferFrom(msg.sender, to, newItemId);
        }
        emit MintCertificateEvent(
            block.timestamp,      
            msg.sender,
            to,
            newItemId,
            tkuri
        );
    }

    function approveTokenToAdmin(uint256 tokenId)external {
        address owner=_ownerOf(tokenId);
        require (msg.sender==owner,"only owner can give the approval");
        approve(Admin,tokenId);
        emit ApproveOwnerEvent(block.timestamp ,tokenId,  msg.sender, Admin);
    }

    function approveTokenToAddress(uint256 tokenId,address to)external {
        address owner=_ownerOf(tokenId);
        require (msg.sender==owner,"only owner can give the approval to anyone");
        approve(to,tokenId);
        emit ApproveAnyoneEvent(block.timestamp ,tokenId,  msg.sender, to);
    }

    function update_NFTtokenUri(uint256 tokenid, string memory tkuri) external {
        _setTokenURI(tokenid, tkuri);
        emit DataUriSetEvent( block.timestamp,
            msg.sender,
            tokenid,
            tkuri);
    }

    function transferTokenByApprover(uint256 tokenid, address to) external  {
        require(to != address(0), "To address is not specified");
        require(to != msg.sender, "Sender should not be receiver");
        address approvedAddress=_getApproved(tokenid);
        require (msg.sender==approvedAddress,"only approved person can transfer the token");
         address owner=_ownerOf(tokenid);
        safeTransferFrom(owner, to, tokenid);
        //update token data
        emit TransferDataEvent(block.timestamp,tokenid, msg.sender, to);
    }

       function transferTokenByOwner(uint256 tokenid, address to) external  {
        require(to != address(0), "To address is not specified");
        require(to != msg.sender, "Sender should not be receiver");
       address owner=_ownerOf(tokenid);
        require (msg.sender==owner,"only owner can transfer token to anyone");
        safeTransferFrom(msg.sender, to, tokenid);
        //update token data
        emit TransferDataEvent(block.timestamp,tokenid, msg.sender, to);
    }
}

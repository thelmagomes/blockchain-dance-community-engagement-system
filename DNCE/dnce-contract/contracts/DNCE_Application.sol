// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract DNCE_Application {
    
    
    string public constant name = "DaNceCommunityEngagement";
    string public constant symbol = "DNCE";
    uint8 public constant decimals = 2;  

    event Approval(address indexed tokenOwner, address indexed user, uint no_tokens);
    event Transfer(address indexed from, address indexed to, uint no_tokens);


    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 _totalSupply;

    using SafeMath for uint256;
    
    address admin;
    uint admin_balance;
    
        // All the application mappings created here
    
    mapping(address=>uint) membership;
    
    mapping(address=>Student) StudentDetails;
    mapping(address=>Teacher) TeacherDetails;
    mapping(address=>StudioRenter) StudioRentalDetails;
    mapping(address=>StudioOwner) StudioOwnerDetails;
    
    // All the user structures defined here
    struct Student {
        bool is_Student;
        uint s_wallet;
        uint classes_taken;
    }
    
    struct Teacher {
        bool is_Teacher;
        uint t_wallet;
        uint class_fees;
    }
    
    struct StudioRenter {
        bool is_StudioRenter;
        uint m_wallet;
        uint rent_Amount;
        uint time_hours;
    }
    
    struct StudioOwner {
        bool is_StudioOwner;
        uint o_wallet;
        uint rent_Amount;
        uint time_hours;
    }
    
    // Token related functions defined here
    
    function totalSupply() public view returns (uint256) {
	return _totalSupply;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }
    
    function increaseAllowance(address delegate, uint256 incValue) public virtual returns (bool) {
        approve(delegate, allowed[msg.sender][delegate] + incValue);
        return true;
    }
    
    function decreaseAllowance(address delegate, uint256 decValue) public virtual returns (bool) {
        uint256 currentAllowance = allowed[msg.sender][delegate];
        require(currentAllowance >= decValue, "ERC20: decreased allowance below zero");
        unchecked {
            //uint256 value = currentAllowance - decValue;
            approve(delegate, currentAllowance - decValue);
            
        }
        //approve(delegate, value);

        return true;
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);    
        require(numTokens <= allowed[owner][msg.sender]);
    
        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
    

    
    constructor(uint256 total) public payable {
        // For total tokens
        _totalSupply = total;
	    balances[msg.sender] = _totalSupply;
	    
	    // Admin rights
        admin=msg.sender;
        membership[admin] = 1;
        admin_balance = _totalSupply;
    }
    
    
    // Modifiers
    
    modifier onlyAdmin{ 
        require(msg.sender==admin, "User is not Admin. Rights denied.");
        _;
    }
    
    modifier onlyMember {
        require(membership[msg.sender] == 1);
        _;
    }
    
    modifier onlyTeacher {
        require(TeacherDetails[msg.sender].is_Teacher);
        _;
    }
    
    modifier onlyStudioOwner {
        require(StudioOwnerDetails[msg.sender].is_StudioOwner);
        _;
    }

    function viewAdminBalance() public onlyAdmin view returns (uint){
        return admin_balance;
    }  

    function viewMembership() public view returns (uint){
        return membership[msg.sender];
    }
    
    // Registration functions
    
    function registerStudent() public payable {
        address student = msg.sender;

        // Check if already registered
        if(StudentDetails[msg.sender].is_Student){
            revert(" Student already registered. ");
        }

        // Else register if not already
        membership[student] = 1;
        //balances[student] = 5000;
        StudentDetails[msg.sender].classes_taken= 0;
        StudentDetails[msg.sender].is_Student = true;
        balances[msg.sender] = balances[msg.sender] + 5000;
        StudentDetails[msg.sender].s_wallet = balances[student];
    }
    
    function registerTeacher(uint fees_to_charge) public payable {
        address teacher = msg.sender;
        
        // Check if already registered
        if(TeacherDetails[msg.sender].is_Teacher){
            revert(" Teacher already registered. ");
        }

        // Else register if not already
        membership[teacher]=1;
        //balances[teacher]= 0;
        TeacherDetails[msg.sender].class_fees = fees_to_charge;
        TeacherDetails[msg.sender].is_Teacher = true;
        balances[msg.sender] = balances[msg.sender] + 0;
        TeacherDetails[msg.sender].t_wallet = balances[teacher];
    }
    
    function registerStudioRenter() public payable {
        address renter = msg.sender;

        // Check if already registered
        if(StudioRentalDetails[msg.sender].is_StudioRenter){
            revert(" Studio Renter already registered. ");
        }

        // Else register if not already

        membership[renter]=1;
        //balances[renter] = 5000;
        //StudioRentalDetails[msg.sender].m_wallet = balances[renter];
        StudioRentalDetails[msg.sender].rent_Amount = 0;
        StudioRentalDetails[msg.sender].time_hours = 0;
        StudioRentalDetails[msg.sender].is_StudioRenter = true;
        balances[msg.sender] = balances[msg.sender] + 5000;
        StudioRentalDetails[msg.sender].m_wallet = balances[renter];
        
        /*if(studioOwner == 1){
            StudioRentalDetails[msg.sender].is_StudioOwner = true;
        }*/

    }
    
    function registerStudioOwner(uint rent_to_charge_per_hour) public payable {
        address owner = msg.sender;

        // Check if already registered
        if(StudioOwnerDetails[msg.sender].is_StudioOwner){
            revert(" Studio Owner already registered. ");
        }

        // Else register if not already
        membership[owner]=1;
        //balances[owner] = 0;
        StudioOwnerDetails[msg.sender].rent_Amount = rent_to_charge_per_hour;
        StudioOwnerDetails[msg.sender].time_hours = 1;
        StudioOwnerDetails[msg.sender].is_StudioOwner = true;
        balances[msg.sender] = balances[msg.sender] + 0;
        StudioOwnerDetails[msg.sender].o_wallet = balances[owner];

    }
    
    // Functions to get user Details
    
    function getStudentDetails(address student) public view returns (uint, uint) {
        if(membership[msg.sender]!=1){
            revert(" Provision of details not permitted. Please register yourself into the system. ");
        }
        if(!StudentDetails[student].is_Student){
            revert(" Student not registered. ");
        }
        
        uint classes_taken = StudentDetails[student].classes_taken;
        //StudentDetails[student].s_wallet = balances[student];
        return (balances[student] , classes_taken);
    }
    
    
    function getTeacherDetails(address teacher) public view returns (uint, uint) {
        if(membership[msg.sender]!=1){
            revert(" Provision of details not permitted. Please register yourself into the system. ");
        }
        if(!TeacherDetails[teacher].is_Teacher){
            revert(" Teacher not registered. ");
        }
        
        uint class_fees = TeacherDetails[teacher].class_fees;
        //TeacherDetails[teacher].t_wallet = balances[teacher];
        return (balances[teacher], class_fees);
    }
    
    
    function getStudioRenterDetails(address renter) public view returns (uint, uint, uint) {
        if(membership[msg.sender]!=1){
            revert(" Provision of details not permitted. Please register yourself into the system. ");
        }
        if(!StudioRentalDetails[renter].is_StudioRenter){
            revert(" Renter not registered. ");
        }
        
        uint rent_Amount = StudioRentalDetails[renter].rent_Amount;
        uint time_hours = StudioRentalDetails[renter].time_hours;
        //StudioRentalDetails[renter].m_wallet = balances[renter];
        return (balances[renter], rent_Amount, time_hours);
    }
    
    function getStudioOwnerDetails(address owner) public view returns (uint, uint, uint) {
        if(membership[msg.sender]!=1){
            revert(" Provision of details not permitted. Please register yourself into the system. ");
        }
        if(!StudioOwnerDetails[owner].is_StudioOwner){
            revert(" Studio Owner not registered. ");
        }
        
        uint rent_Amount = StudioOwnerDetails[owner].rent_Amount;
        uint time_hours = StudioOwnerDetails[owner].time_hours;
        //StudioOwnerDetails[owner].o_wallet = balances[owner];
        return (balances[owner], rent_Amount, time_hours);
    }


    // Special functions of the application
    
    function purchaseClass(address payable teacher) public onlyMember payable returns (uint){
        address student = msg.sender;
        if(!StudentDetails[student].is_Student){
            revert(" Unable to purchase this class. Please register as Student first. ");
        }
        
        if(!TeacherDetails[teacher].is_Teacher){
            revert(" Desired teacher is not registered. Please check. ");
        }
        
        uint class_fees = TeacherDetails[teacher].class_fees;
        uint classes_taken = StudentDetails[student].classes_taken;
        
        transfer(teacher, class_fees);
        //StudentDetails[student].s_wallet = StudentDetails[student].s_wallet - class_fees;
        //TeacherDetails[teacher].t_wallet = TeacherDetails[teacher].t_wallet + class_fees;
        StudentDetails[student].s_wallet = balances[student];
        TeacherDetails[teacher].t_wallet = balances[teacher];
        
        // Update classes taken count
        //classes_taken = classes_taken + 1;
        StudentDetails[student].classes_taken = classes_taken + 1;
        return class_fees;
    }
    
    function rentStudio(address payable studio_owner, uint number_of_hours) public onlyMember payable returns (uint) {
        address renter = msg.sender;
        if(!StudioOwnerDetails[studio_owner].is_StudioOwner){
            revert(" The Studio Owner is not registered. Operation aborted. ");
        }
        
        if(membership[renter]!=1){
            revert(" Not a member. ");
        }
        
        uint rent_Amount_stated_by_owner = StudioOwnerDetails[studio_owner].rent_Amount;
        uint total_rent_amount = (rent_Amount_stated_by_owner * number_of_hours);
        
        transfer(studio_owner, total_rent_amount); 
        //StudioOwnerDetails[studio_owner].o_wallet = StudioOwnerDetails[studio_owner].o_wallet + total_rent_amount;
        //StudioRentalDetails[msg.sender].m_wallet = StudioRentalDetails[msg.sender].m_wallet - total_rent_amount;
        StudioOwnerDetails[studio_owner].o_wallet = balances[studio_owner];
        StudioRentalDetails[renter].m_wallet = balances[renter];

        return total_rent_amount;
        
    }
    
    
    function settlePayment(address payable owner, address payable renter, uint amount) public onlyStudioOwner payable {
        address studio_owner = owner;
        uint payment = amount;

        transferFrom(renter, owner,  payment);
        StudioRentalDetails[renter].m_wallet = StudioRentalDetails[renter].m_wallet - payment;
        StudioOwnerDetails[studio_owner].o_wallet = StudioOwnerDetails[studio_owner].o_wallet + payment;
        
        
    }

    function classCompletionRewards(address payable user) public onlyAdmin payable returns (uint){
        uint classes_taken = StudentDetails[user].classes_taken;
        uint rewardAmount = 2000;
        if(classes_taken > 3) {
            transfer(user, rewardAmount);
            admin_balance = admin_balance - rewardAmount;
            balances[admin] = admin_balance;
            classes_taken = 0;
            
        }

        return rewardAmount;
    }
    
    // UNREGISTER - Rights only with Admin
    function unregister (address payable user) onlyAdmin public {
        
        if(msg.sender != admin){
            revert(" Denied rights to perform this action. ");
        }
        membership[user]= 0;
        balances[user] = 0;  //User balance is reset.
        if (StudentDetails[user].is_Student){
            StudentDetails[user].is_Student = false;
            delete (StudentDetails[user]);
        }
        if (TeacherDetails[user].is_Teacher){
            TeacherDetails[user].is_Teacher = false;
            delete(TeacherDetails[user]);
        }
        if (StudioRentalDetails[user].is_StudioRenter){
            StudioRentalDetails[user].is_StudioRenter = false;
            delete(StudioRentalDetails[user]);
        }
        if (StudioOwnerDetails[user].is_StudioOwner){
            StudioOwnerDetails[user].is_StudioOwner = false;
            delete(StudioOwnerDetails[user]);
        }
    }
    
}

    // Math Library
library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
    
    function multiply(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a * b;
      assert(c >= a);
      return c;
    }
}

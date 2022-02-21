App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
    // $.getJSON('../users2.json', function(data) {
    //   var proposalsRow = $('#proposalsRow');
    //   var proposalsRow1 = $('#proposalsRow1');
    //   var proposalTemplate = $('#proposalTemplate ');

    //   for (i = 0; i < 2; i ++) {
    //     proposalTemplate.find('.panel-title').text(data[i].name);
    //     proposalTemplate.find('img').attr('src', data[i].picture);
    //     proposalTemplate.find('.btn-dnce-register').attr('data-id', data[i].id);
        
    //     proposalsRow.append(proposalTemplate.html());
    //     App.names.push(data[i].name);
    //   }
    //   for (i = 2; i < 5; i ++) {
    //     proposalTemplate.find('.panel-title').text(data[i].name);
    //     proposalTemplate.find('img').attr('src', data[i].picture);
    //     proposalTemplate.find('.btn-dnce-register').attr('data-id', data[i].id);
        
    //     proposalsRow1.append(proposalTemplate.html());
    //     App.names.push(data[i].name);
    //   }
    // });
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('DNCE_Application.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var DNCEArtifact = data;
    App.contracts.dnce = TruffleContract(DNCEArtifact);

    // Set the provider for our contract
    App.contracts.dnce.setProvider(App.web3Provider);
    App.currentAccount = web3.eth.coinbase;
    jQuery('#current_account').text(App.currentAccount);
    
    App.getAdmin();
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-dnce-register-student', function(){App.registerStudent(); });
    $(document).on('click', '.btn-dnce-register-teacher', function(){App.registerTeacher(); });
    $(document).on('click', '.btn-dnce-register-renter', function(){App.registerStudioRenter(); });
    $(document).on('click', '.btn-dnce-register-owner', function(){App.registerStudioOwner(); });
    $(document).on('click', '.btn-dnce-details-student', function(){ App.getStudentDetails(); });
    $(document).on('click', '.btn-dnce-details-teacher', function(){ App.getTeacherDetails(); });
    $(document).on('click', '.btn-dnce-details-renter', function(){ App.getStudioRenterDetails(); });
    $(document).on('click', '.btn-dnce-details-owner', function(){ App.getStudioOwnerDetails(); });
    $(document).on('click', '.btn-purchase', function(){ App.purchaseClass(); });
    $(document).on('click', '.btn-rent', function(){ App.rentStudio(); });
    $(document).on('click', '#class-rewards', App.classRewards);
    $(document).on('click', '#register', function(){ var ad = $('#enter_address').val(); App.handleRegister(ad); });
    $(document).on('click', '#unreg', function(){App.unregister(); });
    $(document).on('click', '.btn-dnce-balance', function(){App.viewMyBalance(); });
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      web3.eth.defaultAccount=web3.eth.accounts[0]
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        }
      });
    });
  },

  getAdmin : function(){
    App.contracts.dnce.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      //App.admin = result.constructor.currentProvider.selectedAddress.toString();
      App.admin = '0x583E726EC9Dd584e7fdA84acfDfD93f78c81470C'
      //App.currentAccount = web3.eth.coinbase;
      //App.currentAccount = result.constructor.currentProvider.selectedAddress.toString();
      //alert(App.currentAccount)
      if(App.currentAccount == App.admin){
        
        document.getElementById("admin_stuff").style.visibility="hidden";
        //document.getElementById("class-rewards").style.visibility="hidden";
        //document.getElementById("unregister_addr").style.visibility="hidden";
        //document.getElementById("unreg").style.visibility="hidden";
      
        
      }else{
        document.getElementById("admin_stuff").style.visibility="visible";
        //document.getElementById("class-rewards").style.visibility="visible";
        //document.getElementById("class-unregister_addr").style.visibility="visible";
        //document.getElementById("class-unreg").style.visibility="visible";
       
      }
    })
  },

    //required
    purchaseClass: function(){
      var dnceInstance;
      addr = document.getElementById('purchase').value
      App.contracts.dnce.deployed().then(function(instance) {
        dnceInstance = instance;
        return dnceInstance.purchaseClass(addr);
      }).then(function(result, err){
          if(result){
              val= result.toString()
              alert(" Class purchase successful.")

          } else {
              alert(" Class purchase failed.")
          }   
      })
  
  },

      //required
      rentStudio: function(){
        var dnceInstance;
        addr = document.getElementById('rent').value
        hrs = parseInt(document.getElementById('rent_hrs').value)
        App.contracts.dnce.deployed().then(function(instance) {
          dnceInstance = instance;
          return dnceInstance.rentStudio(addr, hrs);
        }).then(function(result, err){
            if(result){
                val= result.toString()
                alert (val)
                //if(parseInt(result.receipt.status) == 1)
                alert(" Total rent charged is " + val + " DNCE Tokens successful.")
  
            } else {
                alert(" Unable to rent.")
            }   
        })
    
    },

    // required
    classRewards: function(){
      var dnceInstance;
      addr = document.getElementById('reward_addr').value
      //hrs = parseInt(document.getElementById('rent_hrs').value)
      App.contracts.dnce.deployed().then(function(instance) {
        dnceInstance = instance;
        return dnceInstance.classCompletionRewards(addr);
      }).then(function(result, err){
          if(result){
              val= result.toString()
              if(parseInt(result.receipt.status) == 1)
              alert("20 DNCE tokens granted as reward.")

          } else {
              alert(" Transaction failed. ")
          }   
      })
  
  },


  //required
  registerStudent: function(){
    var dnceInstance;
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.registerStudent();
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(" Student registration done successfully")
            else
            alert(" Student registration not done successfully due to revert")
        } else {
            alert(" Student registration failed")
        }   
    })

},

  //required
  registerTeacher: function(){
    var dnceInstance;
    var fees = parseInt(prompt("Please enter the Fees to be charged per class. (2 decimals value to be taken.)"));

    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      if (fees != null) {       
        return dnceInstance.registerTeacher(fees);
        }
      
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1) {
            alert(" Teacher registration done successfully")
            document.getElementById("detailsTeacher").innerHTML = fees + " DNCE tokens will be charged per class.";}
            else
            alert(" Teacher registration not done successfully due to revert")
        } else {
            alert(" Teacher registration failed")
        }   
    })

},

  //required
  registerStudioRenter: function(){
    var dnceInstance;
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.registerStudioRenter();
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(" Studio Renter registration done successfully")
            else
            alert(" Studio Renter registration not done successfully due to revert")
        } else {
            alert(" Studio Renter registration failed")
        }   
    })

},

  //required
  registerStudioOwner: function(){
    var dnceInstance;
    var rent = parseInt(prompt("Please enter the rent to be charged per hour. (2 decimals value to be taken.)"));
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.registerStudioOwner(rent);
    }).then(function(result, err){
      if (err){
        alert(err)
      }  
      if(result){
            if(parseInt(result.receipt.status) == 1){
            alert(" Studio Owner registration done successfully")
            document.getElementById("detailsOwner").innerHTML = rent + " DNCE tokens will be charged per hour.";}
            else
            alert(" Studio Owner registration not done successfully due to revert");
        } else {
            alert(" Studio Owner registration failed")
        }   
    })

},

//uregister
unregister: function(){
  var dnceInstance;
  var adr = prompt("Please enter the De-centralized identity/address to be unregistered");
  //var adr =  document.getElementById('unregister_addr').value
  App.contracts.dnce.deployed().then(function(instance) {
    dnceInstance = instance;
    return dnceInstance.unregister(adr);
  }).then(function(result, err){
    if (err){
      alert(err)
    }  
    if(result){
          if(parseInt(result.receipt.status) == 1){
          alert(" Unregistration done successfully")
        }
          else
          alert(" Uegistration not done successfully due to revert");
      } else {
          alert(" Unregistration failed")
      }   
  })

},

  //required
  getStudentDetails: function(){
    var dnceInstance;
    var addr = prompt("Please enter the De-centralized Identity/ ADDRESS.");
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.getStudentDetails(addr);
    }).then(function(result, err){
        if(result){
          val= result.toString()
          //alert(val)
          var classes_taken = val.split(',')[1]
          document.getElementById("detailsStudent").innerHTML = "Number of classes taken: " + classes_taken;
        }
        //   if(parseInt(result.receipt.status) == 1)
        //     //var balance = result.split(',')[0]
        //     //var classes_taken = result.split(',')[1]
        //     alert(result)
        //     document.getElementById("detailsStudent").innerHTML = "Number of classes taken: " ; //+ classes_taken;
        // //     alert(" Student registration done successfully")
        // //     else
        // //     alert(" Student registration not done successfully due to revert")
        // } else {
        //      alert(" Student registration failed")
        //  }   
    })

},

  //required
  getTeacherDetails: function(){
    var dnceInstance;
    var addr = prompt("Please enter the De-centralized Identity/ ADDRESS.");
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.getTeacherDetails(addr);
    }).then(function(result, err){
        if(result){
          val= result.toString()
          //alert(val)
          var class_fees = val.split(',')[1]
          document.getElementById("detailsTeacher").innerHTML = "Fees charged per class in DNCE tokens: " + class_fees;
        } 

    })

},

  //required
  getStudioRenterDetails: function(){
    var dnceInstance;
    var addr = prompt("Please enter the De-centralized Identity/ ADDRESS.");
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.getStudioRenterDetails(addr);
    }).then(function(result, err){
        if(result){
          val= result.toString();
          //alert(val);
          var rent_Amt = val.split(',')[1]
          var time_hours = val.split(',')[2]
          document.getElementById("detailsRenter").innerHTML = " you have a total balance of " + val.split(',')[0] + " DNCE tokens left in your wallet. " + "Total rent charged for your account till now is " + rent_Amt + " DNCE tokens for " + time_hours;
        } 
    })

},

  //required
  getStudioOwnerDetails: function(){
    var dnceInstance;
    var addr = prompt("Please enter the De-centralized Identity/ ADDRESS.");
    App.contracts.dnce.deployed().then(function(instance) {
      dnceInstance = instance;
      return dnceInstance.getStudioOwnerDetails(addr);
    }).then(function(result, err){
        if(result){
          val= result.toString()
          //alert(val)
          var rent_Amt = val.split(',')[1]
          var time_hours = val.split(',')[2]
          document.getElementById("detailsOwner").innerHTML = "Total rent charged for " + time_hours + " hour is " + rent_Amt + " DNCE tokens";
        } 
    })

},

viewMyBalance: function(){
  var dnceInstance;
  var addr = web3.eth.coinbase; //current address
  App.contracts.dnce.deployed().then(function(instance) {
    dnceInstance = instance;
    return dnceInstance.balanceOf(App.currentAccount);
  }).then(function(result, err){
      if(result){
        val= result.toString()
        //alert(val)
        document.getElementById("balance").innerHTML = "Your Balance is " + val + " DNCE tokens";
      } 
  })

},

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

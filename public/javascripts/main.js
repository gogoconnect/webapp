$('document').ready(function() {

	$(window).keydown(function(party){
		if(party.keyCode == 13) {
			party.preventDefault();
			return false;
		}
	});

	var numElements = 0;
	var i = 0; 
	
	var conversations = []; 
	var currentConversation = 0; 

	$('#messageBar, #userBar, #chatBox, #submit').hide();
	
	//var Message = Parse.Object.extend("Message");
	//var Conversation = Parse.Object.extend("Conversation");
	
	function onNewMessage(conversationID) {
		$("#"+conversationID).css("background-color","red");
	}

	var name = "";
	// search function to find a user to chat with
	$('#search').click(function() {
		$('#messageBar, #submit').fadeIn();
		$('#welcome_message').slideUp();
		$('body').attr('id', 'planebgc');
		name = $('#searchBar').val().toLowerCase();
		var nameArray = name.split(' ');
		var fName = nameArray[0]; var lName = nameArray[1];
		
		$.ajax({
			type: "POST",
			url: '/search',
			data: {
				firstname: fName,
				lastname: lName
			},
			success: function(user) {
		        //need to find a way to access the ID of the div element that's clicked on
		        /*var namesArr = [];
		        for (var i = 0; i < user.length; i++) {
		        		//$('.matches').append('<li> <div id='+user[i][0].objectId+'>'+user[i][0].firstName + ' ' +user[i][0].lastName+'</div></li>');
		        		namesArr.push(user[i][0].firstName + ' ' + user[i][0].lastName);
		        }
		        $("#searchBar").autocomplete({
		        	source: namesArr
		        });*/
		        /*$('.matches').dropit();
		        var theUser = $('.matches').find( // this is the user that's clicked on 
		        createNewConversation(theUser.objectId); */
		        
		        createNewConversation(user[0][0].objectId);
    		}
    	});
	});
	
	// send message to the chat
	$('#submit').click(function() {
		var txt = $('#messageBar').val();
		$('#messageBar').val('');
		$('#chatBox, #userBar').fadeIn();
		$('#chatBox').append('<div id='+currentConversation+'>'+txt+'</div>');
		
		$.ajax({
			type: "POST",
			url: '/submit',
			dataType: "json",
			data: {
				conversationId: currentConversation,
				msgText: txt
			},
			success: function(message) {
				console.log("successful submission");
			}
		});
	});

	
	function createNewConversation(uID) {
		$.ajax({
			type: "POST",
			url: '/createConversation',
			dataType: "json",
			data: { recipient: uID },
			success: function(convos) {
				console.log(convos);
				var nameArray = name.split(' ');
				$('#userBar').append('<div class="user" id='+convos.objectId+'text-align: center>'+ nameArray[0] +'</div>');
					// getUser(convos.UID2,convos.objectId)
				resizeElements();
				currentConversation = convos.objectId;
				conversations.push(currentConversation);
			},
			error: function(error) { console.log(error); }
		});
	}
	
	function getUser(uID,divID) {
		$.ajax({
			type: "POST",
			url: '/getUserID',
			dataType: "json",
			data: { userId: uID },
			success: function(user) {
				console.log(user);
				var fName = user.firstName; 
				setName(fName, divID);
				return fName;
			}
		});
	}
	
	function setName(name, divID) { $('#'+divID).val(name); }
	
	function alertUser(convoID) { $('#'+convoID).css("background-color","red"); }
	function resizeElements() {
		numElements++;
		var availHeight = $('#userBar').height()/numElements; 
		var availWidth = $('#userBar').width()/numElements;
		$('.user').each(function() {
			$(this).height(availHeight);
		});
	}
	
	
	
	
});
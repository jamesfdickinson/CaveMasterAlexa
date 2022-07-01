function CaveMaster(currentRoom) {
    //public
    this.rooms = [];
    this.currentRoom;
    this.soundPlaying = false;
    
    //private
    var _this = this;
    
   

    this.getRoom = function (roomName) {
        if (typeof roomName == "undefined") return null;
        for (var key in this.rooms) {
            if (this.rooms[key] && this.rooms[key].name == roomName)
                return this.rooms[key];
        }
        return null;
    };
    this.processSpeech = function (speechWords) {
        //repeat
        if (speechWords.indexOf("repeat") != -1) {
            this.enterRoom(this.currentRoom, speechWords);
            return this.currentRoom;
        }

        if (speechWords == "enter cave"|| speechWords == "enter cave"||speechWords == "yes"||speechWords == "Yes") {
            var room = this.getRoom("EnterCave");
            this.currentRoom = room;
            return room;
        }

        var nextRooms = this.currentRoom.nextRooms;
        for (var roomKey in nextRooms) {
            var room = nextRooms[roomKey];
            var keywords = room.keywords;
            
            for (var keywordKey in keywords) {
                var keyword = keywords[keywordKey];
                if (speechWords.indexOf(keyword) != -1) {
                    this.enterRoom(room, speechWords);
                    return room;
                }
            }
        }
        return null;
    };
    this.enterRoom = function (room, speechWords) {
        //success found something
        this.currentRoom = room;
        console.log("current room "+ room.name);
        //	img.src = currentRoom.imagePath;
      
        console.log("speechWords " + speechWords);
        
        //todo:send event so reader can play sound
        //todo:chain together auto move rooms

    //    if (currentRoom.soundPath != null && currentRoom.soundPath != "") {
    //        document.getElementById("mic").src = 'img/speaker.png';
    //        speech.stop();
    //        soundPlaying = true;
    //        snd.src = currentRoom.soundPath;
    //        snd.play();
				////text.innerHTML = 'I am here';

    //    }
    //    else {
    //        var msg = new SpeechSynthesisUtterance(currentRoom.text);
    //        window.speechSynthesis.speak(msg);
    //    }
    };
    this.getAllActions = function (rooms) {
        if (typeof rooms == "undefined")
            rooms = this.rooms;

        var allActions = [];
        for (var i in rooms) {
            var keywords = rooms[i].keywords;
            if (keywords) {
                for (var j in keywords) {
                    var keyword = keywords[j];
                    if (keyword)
                        allActions.push(keyword);
                }
            }
        }
        return allActions;
    };
    
    this.createRooms = function () {
        //define variables
        var keywords;
        var NOTUSED = null;
        var AUTOMOVE = true;
        var WAITMOVE = false;
        var rooms = [];

        //define rooms
        var enterCave = new Room(
            "EnterCave",
		"You enter cave and you see stuff on your left and its a gangster and hes all like looking very scary like and on your right you see a big nasty ugly spider which way should you go?",
		"snd/Enter Cave - Spider Or Gankster.mp3",
		"img/enternce.png",
		["vegan", "search", "art", "Enter",  "cave", "enter", "start", "begin", "go", "master", "play", "again", "Intercape",  "Winter", "yea", "sure", "ok", "yes","enter cave"]
        );
        rooms.push(enterCave);
        
        var endGame = new Room(
            "endGame",
		"The end. Play again?",
		"snd/theend.mp3",
		"img/the-end.jpg",
		["end"]
        );
        rooms.push(endGame);
        
        var spiderStart = new Room(
            "spiderStart",
		"ohh You choose to go to the spider probly not a very good idea he got venom, so what would you like to do punch the spider in the gut or run past the spider? make your choice",
		"snd/Enter Cave - Spider.mp3",
		"img/spider.png",
		["right", "spider", "big", "nasty", "ugly","go to the spider"]
        );
        rooms.push(spiderStart);
        
        var spiderPunch = new Room(
            "spiderPunch",
		"you decide to punch the spider in the gut. success the spider has been knocked out and you walk on to the next part of the cave good choice",
		"snd/Spider - Punch.mp3",
		"img/spider.png",
		["punch", "fight", "Tech"],
		AUTOMOVE
        );
        rooms.push(spiderPunch);
        
        var spiderRun = new Room(
            "spiderRun",
		"you to decide to run past the spider, the spider notices you he jumps you and all his friends come out and bite you with venom you die the end",
		"snd/Spider - Kills You.mp3",
		"img/spider.png",
		["run", "avoid", "past"],
		AUTOMOVE
        );
        rooms.push(spiderRun);
        
        var gangsterStart = new Room(
            "gangsterStart",
		"so you decide to go see the gangsta the gangstas like sup and gives you a high five, what should you do trust the ganster and keep on walking or should you attack him",
		"snd/Enter Cave - Gankster.mp3",
		"img/gankster.png",
		["gangster", "gangsta", "left", "gang", "les", "las"]
		
        );
        rooms.push(gangsterStart);
        
        var gangsterTrust = new Room(
            "gangsterTrust",
		"you decide to trust the gansta probly not a good idea but you just walking all chill you look back hes giving you the eye of a demom but he does nothing good choice",
		"snd/Gankster - Trust Gankster.mp3",
		"img/gankster.png",
		["trust", "run", "five", "flee"],
		AUTOMOVE
        );
        rooms.push(gangsterTrust);
        
        
        
        var gangsterAttack = new Room(
            "gangsterAttack",
		"you tromp and attack the gansta he comes back he smacks you in the head and you beat him down you win but then the gansta calls all his friends hes cheating he takes out his pistal and booom you dead bad choice",
		"snd/Gankster - Jacks You.mp3",
		"img/gankster.png",
		["attack", "fight", "gun", "punch", "Tech", "text"],
		AUTOMOVE
        );
        rooms.push(gangsterAttack);
        
        
        var timeMachine = new Room(
            "timeMachine",
		"turn on the time machine or walk past it?",
		"snd/Time Machince - H - Turn On Or Walk Past.mp3",
		"img/gankster.png",
		["time"]
		//AUTOMOVE
        );
        rooms.push(timeMachine);
        
        var bedroom = new Room(
            "bedroom",
		"frigde or bed",
		"snd/Firdge Or Bed - H -.mp3",
		"img/cave.png",
		["no", "walk", "past", "move", "skip", "warcraft", "rock"]
		//AUTOMOVE
        );
        rooms.push(bedroom);
        
        var fridge = new Room(
            "fridge",
		"what would you like to eat, pizza or potatoe salad",
		"snd/Fridge - H - Pizza or Photato Salad.mp3",
		"img/fridge.png",
		["fridge", "food", "eat", "French", "free", "open","open fridge","open the fridge"]
		//AUTOMOVE
        );
        rooms.push(fridge);
        
        var bed = new Room(
            "bed",
		"snooze?",
		"snd/Bed - H - snooze Or wake up.mp3",
		"img/bed.png",
		["bed", "dead", "sleep", "nap", "rest", "snooze", "dismiss", "map"]
		//AUTOMOVE
        );
        rooms.push(bed);
        
        var pizza = new Room(
            "pizza",
		"pizza",
		"snd/Fridge - 01 - Pizza.mp3",
		"img/fridge.png",
		["pizza", "Pizza"],
		AUTOMOVE
        );
        rooms.push(pizza);
        
        var potato = new Room(
            "potato",
		"potato salad",
		"snd/Fridge - H - Potato Salad.mp3",
		"img/fridge.png",
		["potato", "salad"],
		AUTOMOVE
        );
        rooms.push(potato);
        
        var tv = new Room(
            "tv",
		"tv turn on or smash",
		"snd/TV - E - Turn On Or Smash.mp3",
		"img/fridge.png",
		[]
        );
        rooms.push(tv);
        
        var smash = new Room(
            "smash",
		"smash on head",
		"snd/Tv - 01 - Smash on Head.mp3",
		"img/fridge.png",
		[],
		AUTOMOVE
        );
        rooms.push(smash);
        
        var powerRangers = new Room(
            "powerRangers",
		"power Rangers",
		//play power rangers video
		"snd/Tv - 01 - Smash on Head.mp3",
		"img/fridge.png",
		["on", "watch", "play", "power", "rangers"],
		AUTOMOVE
        );
        rooms.push(smash);
        
        var lakepath = new Room(
            "lakepath",
		"lake or path",
	
		"snd/Lake or Path - H.mp3",
		"img/fridge.png",
		[]
		//AUTOMOVE
        );
        rooms.push(lakepath);
        
        var lake = new Room(
            "lake",
		"fast or slow",
		"snd/Swim Speed - H.mp3",
		"img/fridge.png",
		["swim", "lake"]
		//AUTOMOVE
        );
        rooms.push(lake);
        
        var lakefast = new Room(
            "lakefast",
		"fast",
		"snd/Swim Speed- 02 - Fast.mp3",
		"img/fridge.png",
		["fast", "quick", "hurry", "rush", "faster"],
		AUTOMOVE
        );
        rooms.push(lakefast);
        
        var lakeslow = new Room(
            "lakeslow",
		"slow",
		"snd/Path - H - Slow Swim And Run Or Flip.mp3",
		"img/fridge.png",
		["slow", "slower", "down"]
		// AUTOMOVE
        );
        rooms.push(lakeslow);
        
        var backflip = new Room(
            "backflip",
		"backflip",
		"snd/Path - 01 - Backflip.mp3",
		"img/fridge.png",
		["back", "flip", "backflip"],
		 AUTOMOVE
        );
        rooms.push(backflip);
        
        var keeprunning = new Room(
            "keeprunning",
		"keeprunning",
		"snd/Path - 02 - chasm.mp3",
		"img/fridge.png",
		["run", "book", "race", "fun"],
		 AUTOMOVE
        );
        rooms.push(keeprunning);
        
        var path = new Room(
            "path",
		"path",
		"snd/Lake or Path - 02 - You Die.mp3",
		"img/fridge.png",
		["left", "path", "walk", "run"],
		 AUTOMOVE
        );
        rooms.push(path);
        
        //in or bar
        var inorbar = new Room(
            "inorbar",
		"in or bar",
		"snd/INN or Bar - H.mp3",
		"img/fridge.png",
		["wake", "up", "dismiss"]
		// AUTOMOVE
        );
        rooms.push(inorbar);
        
        var inn1 = new Room(
            "inn1",
		"inn1",
		"snd/Inn - H - key or walk on.mp3",
		"img/fridge.png",
		["inn", "in", "unlock", "door", "end"]
		// AUTOMOVE
        );
        rooms.push(inn1);
        
        
        var enterinn = new Room(
            "enterinn",
		"enterinn",
		"snd/Inn - 02 - tigar death.mp3",
		"img/fridge.png",
		["enter", "inn", "in", "unlock", "door", "key", "end"],
		 AUTOMOVE
        );
        rooms.push(enterinn);
        
        var leaveinn = new Room(
            "leaveinn",
		"pirates",
		"snd/Inn - 01 - leave key pirates live.mp3",
		"img/fridge.png",
		["walk", "out", "post", "pirates", "no", "pass", "past", "rock"],
		 AUTOMOVE
        );
        rooms.push(leaveinn);
        
        var bar = new Room(
            "bar",
		"bar",
		"snd/Bar - H - INN or Walk Past outpost.mp3",
		"img/fridge.png",
		["bar"],
		 AUTOMOVE
        );
        rooms.push(bar);
        
        
        var bartoinn = new Room(
            "bartoinn",
		"bartoinn",
		"snd/Bar - 01 - inn live.mp3",
		"img/fridge.png",
		["inn", "in", "end"],
		 AUTOMOVE
        );
        rooms.push(bartoinn);
        
        var bartoout = new Room(
            "bartoout",
		"bartoout",
		"snd/Bar - 02 - walk out dead.mp3",
		"img/fridge.png",
		["walk", "past", "out", "post"],
		 AUTOMOVE
        );
        rooms.push(bartoout);
        
        var catsOrDogs = new Room(
            "catsOrDogs",
		"cats or dogs?",
		"snd/cats and dogs - H.mp3",
		"img/fridge.png",
		[]
        );
        rooms.push(catsOrDogs);
        
        var cats = new Room(
            "cats",
		"cats",
		"snd/cats - H - resurrected or fall.mp3",
		"img/fridge.png",
		["cat", "cats", "kitten", "pool"]
        );
        rooms.push(cats);
        
        var catsLive = new Room(
            "cats",
		"cats",
		"snd/cats - 01 - resurrected live.mp3",
		"img/fridge.png",
		["live", "resurrect", "resurrected"],
		AUTOMOVE
        );
        rooms.push(catsLive);
        
        var catsDie = new Room(
            "catsDie",
		"catsDie",
		"snd/cats - 02 - fall dead.mp3",
		"img/fridge.png",
		["fall", "die", "dead"],
		AUTOMOVE
        );
        rooms.push(catsDie);
        
        var dogs = new Room(
            "dogs",
		"hawaii or bahamas",
		"snd/Dogs - H - hawii or bahamas.mp3",
		"img/fridge.png",
		["dog", "dogs", "puppy", "pound"]
        );
        rooms.push(dogs);
        
        var hawaii = new Room(
            "hawaii",
		"hawaii",
		"snd/Dogs - 01 - hiwaii dead.mp3",
		"img/fridge.png",
		["hawaii", "Hawaii"],
		AUTOMOVE
        );
        rooms.push(hawaii);
        
        var bahamas = new Room(
            "bahamas",
		"bahamas",
		"snd/Dogs - 02 - bahamas live.mp3",
		"img/fridge.png",
		["bahamas", "Bahamas"],
		AUTOMOVE
        );
        rooms.push(bahamas);
        
        
        
        //define connections
        endGame.nextRooms = [enterCave];
        timeMachine.nextRooms = [spiderStart, bedroom];
        enterCave.nextRooms = [spiderStart, gangsterStart];
        spiderStart.nextRooms = [spiderPunch, spiderRun];
        spiderPunch.nextRooms = [bedroom];
        spiderRun.nextRooms = [endGame];
        
        gangsterStart.nextRooms = [gangsterTrust, gangsterAttack];
        gangsterAttack.nextRooms = [endGame];
        gangsterTrust.nextRooms = [catsOrDogs];
        catsOrDogs.nextRooms = [cats, dogs];
        cats.nextRooms = [catsLive, catsDie];
        catsLive.nextRooms = [endGame];
        catsDie.nextRooms = [endGame];
        dogs.nextRooms = [hawaii, bahamas];
        hawaii.nextRooms = [endGame];
        bahamas.nextRooms = [endGame];
        
        
        bedroom.nextRooms = [fridge, bed];
        
        fridge.nextRooms = [potato, pizza];
        potato.nextRooms = [tv];
        tv.nextRooms = [powerRangers, smash];
        powerRangers.nextRooms = [endGame];
        smash.nextRooms = [endGame];
        
        pizza.nextRooms = [lakepath];
        lakepath.nextRooms = [lake, path];
        path.nextRooms = [endGame];
        lake.nextRooms = [lakefast, lakeslow];
        lakefast.nextRooms = [endGame];
        lakeslow.nextRooms = [backflip, keeprunning];
        keeprunning.nextRooms = [endGame];
        backflip.nextRooms = [endGame];
        
        
        
        bed.nextRooms = [bed, inorbar];
        inorbar.nextRooms = [inn1, bar];
        inn1.nextRooms = [enterinn, leaveinn];
        enterinn.nextRooms = [endGame];
        leaveinn.nextRooms = [endGame];
        bar.nextRooms = [bartoinn, bartoout];
        bartoinn.nextRooms = [endGame];
        bartoout.nextRooms = [endGame];
        
        return rooms;
    };


    //onload
    this.rooms = this.createRooms();
    this.currentRoom = this.getRoom(currentRoom);
    if (!this.currentRoom)
        this.currentRoom = this.getRoom("EnterCave");
}
module.exports = CaveMaster;


//room constructor
function Room(name, text, soundPath, imagePath, keywords, autoMove) {
    this.name = name;
    this.text = text;
    this.soundPath = soundPath;
    this.imagePath = imagePath;
    this.keywords = keywords;
    this.autoMove = autoMove;
}
	
	







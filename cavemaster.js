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
        speechWords = speechWords.toLowerCase();
        if (speechWords == "enter cave" || speechWords == "yes" || speechWords == "start over" ) {
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
        console.log("current room " + room.name);
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
            "Spider or gangster?",
            "snd/Enter Cave - Spider Or Gankster.mp3",
            "img/enternce.png",
            ["vegan", "search", "art", "Enter", "cave", "enter", "start", "begin", "go", "master", "play", "again", "Intercape", "Winter", "yea", "sure", "ok", "yes", "enter cave"]
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
            "Fight or run?",
            "snd/Enter Cave - Spider.mp3",
            "img/Spider.png",
            ["right", "spider", "big", "nasty", "ugly", "go to the spider"]
        );
        rooms.push(spiderStart);

        var spiderPunch = new Room(
            "spiderPunch",
            "The spider has been knocked out",
            "snd/Spider - Punch.mp3",
            "img/SpiderKO.png",
            ["punch", "fight", "Tech"],
            AUTOMOVE
        );
        rooms.push(spiderPunch);

        var spiderRun = new Room(
            "spiderRun",
            "Spider bites!",
            "snd/Spider - Kills You.mp3",
            "img/Spiders.png",
            ["run", "avoid", "past"],
            AUTOMOVE
        );
        rooms.push(spiderRun);

        var gangsterStart = new Room(
            "gangsterStart",
            "trust or attack?",
            "snd/Enter Cave - Gankster.mp3",
            "img/Gankster.png",
            ["gangster", "gangsta", "left", "gang", "les", "las"]

        );
        rooms.push(gangsterStart);

        var gangsterTrust = new Room(
            "gangsterTrust",
            "He does nothing, good choice",
            "snd/Gankster - Trust Gankster.mp3",
            "img/catDog.png",
            ["trust", "run", "five", "flee"],
            AUTOMOVE
        );
        rooms.push(gangsterTrust);



        var gangsterAttack = new Room(
            "gangsterAttack",
            "booom you dead",
            "snd/Gankster - Jacks You.mp3",
            "img/Ganksters.png",
            ["attack", "fight", "gun", "punch", "Tech", "text"],
            AUTOMOVE
        );
        rooms.push(gangsterAttack);


        var timeMachine = new Room(
            "timeMachine",
            "turn on the time machine or walk past it?",
            "snd/Time Machince - H - Turn On Or Walk Past.mp3",
            "img/timeMachine.png",
            ["time"]
            //AUTOMOVE
        );
        rooms.push(timeMachine);

        var bedroom = new Room(
            "bedroom",
            "frigde or bed?",
            "snd/Firdge Or Bed - H -.mp3",
            "img/bedroom.png",
            ["no", "walk", "past", "move", "skip", "warcraft", "rock"]
            //AUTOMOVE
        );
        rooms.push(bedroom);

        var fridge = new Room(
            "fridge",
            "pizza or potatoe salad?",
            "snd/Fridge - H - Pizza or Photato Salad.mp3",
            "img/fridge.png",
            ["fridge", "food", "eat", "French", "free", "open", "open fridge", "open the fridge"]
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
            "img/pizza.png",
            ["pizza", "Pizza"],
            AUTOMOVE
        );
        rooms.push(pizza);

        var potato = new Room(
            "potato",
            "potato salad",
            "snd/Fridge - H - Potato Salad.mp3",
            "img/potatoSalad.png",
            ["potato", "salad"],
            AUTOMOVE
        );
        rooms.push(potato);

        var tv = new Room(
            "tv",
            "turn on TV or smash TV",
            "snd/TV - E - Turn On Or Smash.mp3",
            "img/TV.png",
            []
        );
        rooms.push(tv);

        var smash = new Room(
            "smash",
            "Smashed the TV on you head!",
            "snd/Tv - 01 - Smash on Head.mp3",
            "img/smashedTV.png",
            ["smash"],
            AUTOMOVE
        );
        rooms.push(smash);

        var powerRangers = new Room(
            "TV",
            "You turned on the TV",
            "snd/happy-tune2.mp3",
            "img/TVon.png",
            ["on", "watch", "play", "power", "rangers", "turn"],
            AUTOMOVE
        );
        rooms.push(smash);

        var lakepath = new Room(
            "lakepath",
            "Lake or path?",
            "snd/Lake or Path - H.mp3",
            "img/lakepath.png",
            []
            //AUTOMOVE
        );
        rooms.push(lakepath);

        var lake = new Room(
            "lake",
            "Swim fast or slow?",
            "snd/Swim Speed - H.mp3",
            "img/swim.png",
            ["swim", "lake"]
            //AUTOMOVE
        );
        rooms.push(lake);

        var lakefast = new Room(
            "lakefast",
            "Fish attacks!",
            "snd/Swim Speed- 02 - Fast.mp3",
            "img/fish.png",
            ["fast", "quick", "hurry", "rush", "faster"],
            AUTOMOVE
        );
        rooms.push(lakefast);

        var lakeslow = new Room(
            "lakeslow",
            "backflip or run",
            "snd/Path - H - Slow Swim And Run Or Flip.mp3",
            "img/swim.png",
            ["slow", "slower", "down"]
            // AUTOMOVE
        );
        rooms.push(lakeslow);

        var backflip = new Room(
            "backflip",
            "You do a backflip!",
            "snd/Path - 01 - Backflip.mp3",
            "img/backflip.png",
            ["back", "flip", "backflip"],
            AUTOMOVE
        );
        rooms.push(backflip);

        var keeprunning = new Room(
            "keeprunning",
            "You tripped!",
            "snd/Path - 02 - chasm.mp3",
            "img/fall.png",
            ["run", "book", "race", "fun"],
            AUTOMOVE
        );
        rooms.push(keeprunning);

        var path = new Room(
            "path",
            "Oh no, you fell!",
            "snd/Lake or Path - 02 - You Die.mp3",
            "img/fall.png",
            ["left", "path", "walk", "run"],
            AUTOMOVE
        );
        rooms.push(path);

        //in or bar
        var inorbar = new Room(
            "inorbar",
            "Enter the Inn or Bar?",
            "snd/INN or Bar - H.mp3",
            "img/inn.png",
            ["wake", "up", "dismiss"]
            // AUTOMOVE
        );
        rooms.push(inorbar);

        var inn1 = new Room(
            "inn1",
            "You enter the Inn",
            "snd/Inn - H - key or walk on.mp3",
            "img/key.png",
            ["inn", "in", "unlock", "door", "end"]
            // AUTOMOVE
        );
        rooms.push(inn1);


        var enterinn = new Room(
            "enterinn",
            "Aaaa a tiger!!!",
            "snd/Inn - 02 - tigar death.mp3",
            "img/tiger.png",
            ["enter", "inn", "in", "unlock", "door", "key", "end"],
            AUTOMOVE
        );
        rooms.push(enterinn);

        var leaveinn = new Room(
            "leaveinn",
            "pirates",
            "snd/Inn - 01 - leave key pirates live.mp3",
            "img/pirate.png",
            ["walk", "out", "post", "pirates", "no", "pass", "past", "rock"],
            AUTOMOVE
        );
        rooms.push(leaveinn);

        var bar = new Room(
            "bar",
            "inn or outpost",
            "snd/Bar - H - INN or Walk Past outpost.mp3",
            "img/bar.png",
            ["bar"],
            AUTOMOVE
        );
        rooms.push(bar);


        var bartoinn = new Room(
            "bartoinn",
            "inn",
            "snd/Bar - 01 - inn live.mp3",
            "img/inn.png",
            ["inn", "in", "end"],
            AUTOMOVE
        );
        rooms.push(bartoinn);

        var bartoout = new Room(
            "bartoout",
            "Pirates!",
            "snd/Bar - 02 - walk out dead.mp3",
            "img/pirate.png",
            ["walk", "past", "out", "post"],
            AUTOMOVE
        );
        rooms.push(bartoout);

        var catsOrDogs = new Room(
            "catsOrDogs",
            "cats or dogs?",
            "snd/cats and dogs - H.mp3",
            "img/catDog.png",
            []
        );
        rooms.push(catsOrDogs);

        var cats = new Room(
            "cats",
            "cats",
            "snd/cats - H - resurrected or fall.mp3",
            "img/cats.png",
            ["cat", "cats", "kitten", "pool"]
        );
        rooms.push(cats);

        var catsLive = new Room(
            "cats",
            "resurrected!",
            "snd/cats - 01 - resurrected live.mp3",
            "img/cats.png",
            ["live", "resurrect", "resurrected"],
            AUTOMOVE
        );
        rooms.push(catsLive);

        var catsDie = new Room(
            "catsDie",
            "Dead...",
            "snd/cats - 02 - fall dead.mp3",
            "img/cats.png",
            ["fall", "die", "dead"],
            AUTOMOVE
        );
        rooms.push(catsDie);

        var dogs = new Room(
            "dogs",
            "hawaii or bahamas",
            "snd/Dogs - H - hawii or bahamas.mp3",
            "img/dog.png",
            ["dog", "dogs", "puppy", "pound"]
        );
        rooms.push(dogs);

        var hawaii = new Room(
            "hawaii",
            "hawaii!!!",
            "snd/Dogs - 01 - hiwaii dead.mp3",
            "img/island.png",
            ["hawaii", "Hawaii"],
            AUTOMOVE
        );
        rooms.push(hawaii);

        var bahamas = new Room(
            "bahamas",
            "bahamas!!!",
            "snd/Dogs - 02 - bahamas live.mp3",
            "img/island.png",
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

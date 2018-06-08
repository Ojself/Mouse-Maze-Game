

/* ----------------------------------------------------------------------------------------
|
|    The constructor-class for the maze 
|
\-----------------------------------------------------------------------------------------*/
function Game(maze, level) {
    this.maze = maze
    this.level = level
}

var mazeGame = new Game ("", 1)






/* ----------------------------------------------------------------------------------------
|
|    Generating the current map-instance to the DOM.
|    also includes jQuery functionalities (gameplay & visuals)
|
\----------------------------------------------------------------------------------------*/

Game.prototype.makeMap = function () {

    //Clears the map before the level starts
    $(".gameboard").empty() 

    //creates empty div for each array-element, then adds it to the gameboard-div "gameboard"
    for (var i=0; i<20; i++) { 
        for(var j=0; j<32; j++) {
            var cellDiv = $( "<div id='" + i + "-" + j + "' class='cell'></div>" );
            $(".gameboard").append(cellDiv);


            //Adding CSS-classes to the different array-elements. 
            //For visuals AND gameplay-functionality (see jQuery section below)
            if( this.maze[i][j] == "O" ) {
                $( "#" + i + "-" + j ).addClass( "game-area" );

                //Adds visual borders only between "wall" and "game-area" divs
                if(this.maze[i][j-1] === "*") {
                    $( "#" + i + "-" + j ).addClass( "left-border" )
                }
                if(this.maze[i][j+1] === "*") {
                    $( "#" + i + "-" + j ).addClass( "right-border" )
                }
                if(this.maze[i-1][j] === "*") {
                    $( "#" + i + "-" + j ).addClass( "top-border" )
                }
                if(i<19 && this.maze[i+1][j] === "*") {
                    $( "#" + i + "-" + j ).addClass( "bottom-border" )
                }
            }
            //Adding the wall class.
            if( this.maze[i][j] == "*" ) {
                $( "#" + i + "-" + j ).addClass("wall");
            }
            //Adding the start-btn class.
            if( this.maze[i][j] == "S" ) {
                $( "#" + i + "-" + j ).addClass( "start-btn" );
                //Every corner of the start-button gets a different background-image
                if(this.maze[i-1][j] === "O" && this.maze[i][j-1] === "O") {
                    $( "#" + i + "-" + j ).addClass("nw-border")
                }
                if(this.maze[i-1][j] === "O" && this.maze[i][j+1] === "O") {
                    $( "#" + i + "-" + j ).addClass("ne-border")
                }
                if(this.maze[i+1][j] === "O" && this.maze[i][j-1] === "O") {
                    $( "#" + i + "-" + j ).addClass("sw-border")
                }
                if(this.maze[i+1][j] === "O" && this.maze[i][j+1] === "O") {
                    $( "#" + i + "-" + j ).addClass("se-border")
                }
            }
            //Adding the finish-btn class.
            if( this.maze[i][j] == "F" ) {
                //Every corner of the finish-button also gets a different background-image
                $( "#" + i + "-" + j ).addClass( "finish-btn" );
                if(this.maze[i-1][j] === "O" && this.maze[i][j-1] === "O") { //north-west-finish-button
                    $( "#" + i + "-" + j ).addClass( "cartoon_grass_nw" )
                }
                if(this.maze[i-1][j] === "O" && this.maze[i][j+1] === "O") {//north-east-finish-button
                    $( "#" + i + "-" + j ).addClass( "cartoon_grass_ne" )
                }
                if(this.maze[i+1][j] === "O" && this.maze[i][j-1] === "O") {//south-west-finish-button
                    $( "#" + i + "-" + j ).addClass( "cartoon_grass_sw" )
                }
                if(this.maze[i+1][j] === "O" && this.maze[i][j+1] === "O") {//south-east-finish-button
                    $( "#" + i + "-" + j ).addClass( "cartoon_grass_se" )
                }
            }
        }
    }







/* ----------------------------------------------------------------------------------------
|
|    jQuery functionalities (start-button, walls, finish-area, etc...) 
|
\----------------------------------------------------------------------------------------*/
    /*-------------------------------------
    STARTING THE LEVEL
    -------------------------------------*/
    $( ".start-btn" ).click(function() {
        $(".wall").addClass("active")
        $("#hammertime").get(0).load()
        $("#hammertime").get(0).play()

        //different start-msg for different levels
        if      (mazeGame.level == 1){
            $(".hint").text("Move your mouse through the maze. Don't touch the walls!").css("color", "black")
        }
        else if (mazeGame.level == 2) {
            var purpleSnakesTxt = $( "<span class='hint-span'> pointer-eating snakes.</span>").css("color", "purple")
            $(".hint").text("Watch out for those").css("color", "black").append(purpleSnakesTxt)
        }
        else if (mazeGame.level == 3) {
            var evilCurse = $( "<span class='hint-span'>evil curse </span>").css("color", "darkred")
            var lurksHere = $( "<span class='hint-span'>that lurks here</span>").css("color", "black")
            $(".hint").text("This dungeon hints at the ").css("color", "black").append(evilCurse).append(lurksHere)
        }
        
    });
    $( ".start-btn" ).mousedown(function() {
        $( ".start-btn" ).toggleClass("clicked")
    })
    $( ".start-btn" ).mouseup(function() {
        $( ".start-btn" ).toggleClass("clicked")
    })

    /*-------------------------------------
    LOSING THE LEVEL
    for enemies: see separate code block below-> "function injectEnemyLvl2()"
    -------------------------------------*/
    $(".wall").hover(function(){
        if ($(".wall").hasClass("active")) {
            $(".wall").removeClass("active")
            $("#hammertime").get(0).pause()
            $("#wall-hit").get(0).play()

            //different msg for different levels
            if      (mazeGame.level == 1){
                var youLost = $( "<span class='hint-span'>lost. </span>").css("color", "darkred")
                var justPress = $( "<span class='hint-span'>Try again? Just press </span>").css("color", "black")
                var theButton = $( "<span class='hint-span'>the button.</span>").css("color", "chartreuse")
                $(".hint").text("HAH. You ").css("color", "black").append(youLost).append(justPress).append(theButton)
            }
            else if (mazeGame.level == 2) {
                $(".hint").text("Really? The wall? ").css("color", "darkred")
            }
            else if (mazeGame.level == 3) {
                var noFreeTimeSocialLife = $( "<span class='hint-span'>curse you with no free-time or social life!</span>").css("color", "darkred")
                var mwahahaha = $( "<span class='hint-span'> MWAHAHA!</span>").css("color", "black")
                $(".hint").text("The iron-walls ").css("color","black").append(noFreeTimeSocialLife).append(mwahahaha)
                $("#wall-lose").get(0).play()
            }
        };  
    });

    /*-------------------------------------
    WINNING THE LEVEL
    -------------------------------------*/
    $(".finish-btn").hover(function(){
        if ($(".wall").hasClass("active")) {
            $(".wall").removeClass("active")
            $("#hammertime").get(0).pause()
            if (mazeGame.level < 3) {
                $("#teleport").get(0).play()
            }
            else {
                $("#final-level-win").get(0).play(); 
                $(".hint").text("You. You are a champion. You deserve this win.").css("color","gold").css("text-align","center").css("text-shadow","2px 2px black")
            }
            nextLevel() //Chooses the next level (see below)
        };
    });
} //end of makeMap()







/*----------------------------------------------------------------------------------------
|
|    Next level-function
|
\----------------------------------------------------------------------------------------*/

function nextLevel() {
    if (mazeGame.level === 1) {
        secondLevel.makeMap()
        injectEnemyLvl2()
        var whatToDo = $( "<span class='hint-span'>what to do.</span>").css("color", "chartreuse")
        $(".hint").text("Oh, you actually made it? Wow. Well, you know ").append(whatToDo)
    }
    else if (mazeGame.level === 2) {
        thirdLevel.makeMap()
        $(".hint").text("So. Uhm. Lucky you, its a safe zone! No enemies!")
    }
    else if (mazeGame.level >= 3) {
        $("#final-level-win").get(0).play()
    }

    mazeGame.level++
}






/*----------------------------------------------------------------------------------------
|
|    Injecting enemies to DOM
|
\----------------------------------------------------------------------------------------*/

function injectEnemyLvl2() {
    var enemy1 = $( "<div class='lvl2-snakes snake-pos-1'></div>" )
    var enemy2 = $( "<div class='lvl2-snakes snake-pos-2'></div>" )
    var enemy3 = $( "<div class='lvl2-snakes snake-pos-3'></div>" )
    var enemy4 = $( "<div class='lvl2-snakes snake-pos-4'></div>" )
    $(".gameboard").append(enemy1, enemy2, enemy3, enemy4);

    $(".lvl2-snakes").mouseover(function(){
        if ($(".wall").hasClass("active")) {
            $(".wall").removeClass("active")
            var purpleSnakesTxt = $( "<span class='hint-span'> pointer-eating snakes</span>").css("color", "purple")
            var mateTxt = $( "<span class='hint-span'> mate. Try again.</span>").css("color", "black")
            $(".hint").text("You want to avoid the").css("color","black").append(purpleSnakesTxt).append(mateTxt)
        };
    });
}






/*----------------------------------------------------------------------------------------
|
|    Map instances
|
\----------------------------------------------------------------------------------------*/


//FIRST LEVEL
var firstLevel = new Game([
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*"],
    ["*", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "O", "O", "O"],
    ["*", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "O", "O", "O"],
    ["*", "O", "S", "S", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "F", "F", "O"],
    ["*", "O", "S", "S", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "F", "F", "O"],
    ["*", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ]

)

//SECOND LEVEL
var secondLevel = new Game([
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*"],
    ["*", "O", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*"],
    ["*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "*", "*", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "O", "O", "*", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O"],
    ["*", "O", "O", "O", "O", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O"],
    ["*", "O", "S", "S", "O", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "F", "F", "O"],
    ["*", "O", "S", "S", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "F", "F", "O"],
    ["*", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ])

var thirdLevel = new Game([
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ["*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "O", "O", "O", "O"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "O", "O", "*", "*", "*", "O", "O", "*", "*", "*", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "*", "*", "O", "O", "O", "*", "*", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "O", "O", "O", "*", "*", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "*", "O", "*", "*", "*", "*", "O", "*", "*", "O", "O", "O", "O", "*", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "O", "O", "O", "O", "*", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "*", "*", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "O", "O", "*", "O", "O", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "O", "O", "*", "O", "O", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "O", "O", "*", "*", "O", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "O", "O", "*", "*", "O", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "*", "*", "*", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "O", "O", "*", "*", "O", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "O", "O", "*", "*", "*", "*", "O", "*", "*", "*", "*", "O", "*", "*", "O", "O", "*", "*", "*", "O", "O", "*"],
    ["*", "*", "O", "O", "*", "*", "*", "O", "O", "*", "O", "O", "*", "*", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "*", "O", "O", "O"],
    ["*", "O", "O", "O", "O", "*", "*", "O", "O", "*", "*", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "*", "*", "O", "O", "*", "*", "*", "O", "O", "O"],
    ["*", "O", "S", "S", "O", "*", "O", "O", "O", "*", "*", "O", "O", "O", "*", "*", "*", "O", "O", "O", "O", "*", "*", "*", "O", "O", "*", "*", "O", "F", "F", "O"],
    ["*", "O", "S", "S", "O", "*", "O", "O", "O", "*", "*", "*", "O", "O", "O", "O", "O", "O", "O", "O", "*", "*", "*", "O", "O", "O", "O", "*", "O", "F", "F", "O"],
    ["*", "*", "O", "O", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "O", "O", "*"],
    ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
    ])


firstLevel.makeMap()

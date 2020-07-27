var hud_2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function hud_2() {
            Phaser.Scene.call(this, {
                key: 'hud_2',
                active: false
            });
        },

    preload: function () {
        //------------------------------- Joystick

        if (mobileAndTabletCheck()) {
            var url;
            url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
            this.load.plugin('rexvirtualjoystickplugin', url, true);
        }
    },

    create: function () {

        this.playTime = 0;
        this.textToShow = "";

        this.nextText = '';
        this.eventTyping = undefined;
        this.messageToShow = "";


        this.textDialogue = this.add.text(190, 70, "", { //text showing the message of the NPC or Guy Blue
            fontFamily: 'ZCOOL QingKe HuangYou',
            wordWrap: {
                width: 430,
                useAdvancedWrap: true
            },
            align: 'left'
        }).setFontSize(25).setDepth(52);


        this.typingEffect = (text, unlockControls) => {

            if (unlockControls === undefined) unlockControls = true;

            this.messageToShow = text;
            let i = 0;
            this.textToShow = "";
            this.textDialogue.text = this.textToShow;
            if (this.eventTyping !== undefined) this.eventTyping.remove(false); //stop all the typing events, if exist
            this.eventTyping = this.time.addEvent({ // create the event that makes the typing effect
                delay: 50,
                callback: (text) => {
                    this.textToShow += text[i]
                    this.textDialogue.text = this.textToShow;
                    i++
                },
                args: [text],
                repeat: text.length - 1
            });

            if (this.eventCloseDialog !== undefined) this.eventCloseDialog.remove(false); //stop all the timer events, if exist
            this.eventCloseDialog = this.time.addEvent({ // create the event that closes the dialog box after 2 seconds of finished
                delay: text.length * 50 + 2000,
                callback: () => {
                    this.hideDialogue(unlockControls);
                },
                args: [text]
            });
        }



        this.dialogueWindow = this.add.image(400, 100, "messageBoard").setScale(3.5, 1.7).setDepth(50);


        this.textTitle = this.add.text(400, 40, 'Guy Blue', {
            fontFamily: 'ZCOOL QingKe HuangYou'
        }).setFontSize(35).setOrigin(0.5, 0.5).setDepth(51);



        this.textInstruction = this.add.text(480, 160, "Press space bar or interact to continue", {
            fontFamily: 'ZCOOL QingKe HuangYou'
        }).setFontSize(20).setOrigin(0.5, 0.5).setDepth(51);

        this.buttonInteract = this.add.image(720, 420, "interactButton").setOrigin(0.5).setScale(1).setInteractive();

        this.buttonInteractText = this.add.text(this.buttonInteract.x, this.buttonInteract.y, "talk to", {
            fontFamily: 'ZCOOL QingKe HuangYou'
        }).setFontSize(20).setOrigin(0.5, 0.5);


        this.showingDialogue = false;
        this.textTitle.visible = false;
        this.textDialogue.visible = false;
        this.textInstruction.visible = false;
        this.dialogueWindow.visible = false;

        // GeneralInstructions
        this.instructionText = this.add.text(444, 450, "WASD or arrows to move \n Spacebar or Enter to interact", {
            fontFamily: 'ZCOOL QingKe HuangYou',
            fontSize: 30,
            align: 'center'
        }).setOrigin(0.5);

        this.instructionText.visible = false;


        this.flashingTextTween = this.tweens.add({
            targets: this.instructionText,
            alpha: {
                from: 0,
                to: 1
            },
            duration: 500,
            ease: 'Sine.easeInOut',
            loop: -1,
        }).stop();


        createSocialMediaMenu(this);

        createMenu(this, ["Restart ", "Menu ", "Loser Board "], [
            () => {
                console.log("restart") // TODO falta esta
            },
            () => {
                this.game.sound.stopAll();
                this.scene.stop("level_2_2");
                this.scene.start("map");
            },
            () => {
                this.game.sound.stopAll();
                this.scene.stop("level_2_2");
                resetGame();
                this.scene.start("loserBoard", {
                    type: 3,
                    name: null,
                    score: 0,
                    colectionName: "scores_lvl_2"
                })
            }
        ], 250, 40, 750, 40)




        this.input.keyboard.on('keydown_ENTER', (event) => {
            if (!this.showingDialogue) this.interact();
            else if (!controls.buttonsLocked) {
                if (this.textDialogue.text !== this.messageToShow) {
                    this.textDialogue.text = this.messageToShow;
                    if (this.eventTyping !== undefined) this.eventTyping.remove(false);
                } else this.hideDialogue();
            }
        });

        this.input.keyboard.on('keydown_SPACE', (event) => {
            if (!this.showingDialogue) this.interact();
            else if (!controls.buttonsLocked) {
                if (this.textDialogue.text !== this.messageToShow) {
                    this.textDialogue.text = this.messageToShow;
                    if (this.eventTyping !== undefined) this.eventTyping.remove(false);
                } else this.hideDialogue();
            }
        });


        this.buttonInteract.on('pointerdown', () => {
            if (!this.showingDialogue) this.interact();
            else if (!controls.buttonsLocked) {
                if (this.textDialogue.text !== this.messageToShow) {
                    this.textDialogue.text = this.messageToShow;
                    if (this.eventTyping !== undefined) this.eventTyping.remove(false);
                } else this.hideDialogue();
            }
        });


        if (mobileAndTabletCheck()) { //--------------------MOBILE
            // ------------------------- Joystick
            this.joyStickPressed = false; // flag to see if the joystic is being pressed

            this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 100,
                y: 400,
                radius: 80,
                base: this.add.circle(0, 0, 80, 0xCF000000).setAlpha(0.5).setDepth(20),
                thumb: this.add.circle(0, 0, 40, 0xcccccc).setDepth(20),
            });

            this.buttonInteract.setScale(1.5, 1.5);
            this.buttonInteractText.setFontSize(30).setOrigin(0.5).setPosition(this.buttonInteract.x, this.buttonInteract.y);


            this.instructionText.text = "use the virtual joystick to move \n Press the button to interact"
            this.textInstruction.text = "Press interact to continue"
        } else { //-------------------DESKTOP
            this.buttonInteract.on('pointerover', () => {
                this.buttonInteract.setScale(1, 1.1);
            });
            this.buttonInteract.on('pointerout', () => {
                this.buttonInteract.setScale(1, 1);
            });
        }

        this.beerPoints = [];


        // this.beerPoints.forEach(element => {     //uncomment to show circles over the bottles
        //     this.add.circle(element[0]*2,element[1]*2,20,0xff0000);
        // });


        // ------------------------- Time events
        this.time.delayedCall(50, () => {
            this.showDialogue("I hope Matchless still has booze.", false);
            this.textInstruction.visible = false;
        });


        this.time.delayedCall(10000, () => {
            this.showDialogue("Let’s see if there’s beer left in any of these cans.");
            this.textInstruction.visible = true;
            this.beerPoints = [
                [59, 145, "Careful, these cans are rusty."],
                [50, 190, "This one is full...of dust."],
                [159, 173, "Gross, nothing but dead bugs."],
                [260, 189, "Bupkis."],
                [370, 178, "Both empty."],
                [320, 100, "Not a drop in any of these."],
                [292, 130, "Whatever that is, it’s not beer."],
                [259, 96, "Bingo! Wait, nope, just dust."],
                [208, 105, "Nope, nothing in these."],
                [171, 96, "Crap, more empties."]
            ]
        });

        this.time.delayedCall(12000, () => {
            this.instructionText.visible = true;
            controls.buttonsLocked = false;
            controls.joystickLocked = false;

        })

        this.time.delayedCall(29000, () => {
            this.instructionText.visible = false;
            controls.buttonsLocked = true;
            controls.joystickLocked = true;
            this.showDialogue("Oh it looks like the tap is still hooked up. Let’s check it out.", false);
            this.beerPoints = [];
        })



         //--------------------------------------Second part of the level
        this.time.delayedCall(34000, () => {                    
            this.arrows = this.showSetArrows(this.score);
            this.instructionText.text = "Repeat the sequence with joystick or \n arrow keys to refill Guy Blue’s beer."
            this.instructionText.setVisible(true);

            this.arrows.forEach(el=>{
                this.tweens.add({
                    targets: el,
                    alpha: {
                        from: 0,
                        to: 1
                    },
                    duration: 3000,
                    ease: 'Sine.easeInOut',
                    loop: 0,
                })
            })


        })


        this.time.delayedCall(37000, () => {                    //start the game         

            this.instructionText.setVisible(false);

            this.timebar.setVisible(true);
            this.timebarMargin.setVisible(true);

            this.scoreText.setVisible(true); 
            this.scoreTitleText.setVisible(true); 
            this.scoreBeer.setVisible(true);


            this.isPlaying = true;
        })

       
        this.isPlaying = false;
        //score
        this.score = 0;

        this.scoreText = this.add.text(750, 55, "x " + this.score, {
            fontFamily: 'ZCOOL QingKe HuangYou'
        }).setFontSize(30).setShadow(3, 3, 'rgba(0,0,0,0.5)', 4).setVisible(false);

        this.scoreTitleText = this.add.text(700, 10, "SCORE", {
            fontFamily: 'ZCOOL QingKe HuangYou'
        }).setFontSize(35).setShadow(3, 3, 'rgba(0,0,0,0.5)', 4).setVisible(false);

        this.scoreBeer=this.add.image(725, 70, 'level2_beer').setScale(1.4).setVisible(false);

        //arrows
        this.timeForAnswer = 0;
        this.initialTime = 0;
        this.currentArrow = 0;


        this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);



        this.downKey.on('down', (event) => {
            this.directionPressed(down);
        });

        this.upKey.on('down', (event) => {
            this.directionPressed(up);
        });

        this.leftKey.on('down', (event) => {
            this.directionPressed(left);
        });

        this.rightKey.on('down', (event) => {
            this.directionPressed(right);
        });


        // time bar
        this.timebar = this.add.rectangle(300, 490, 300, 20).setFillStyle(0x0000ff).setOrigin(0, 0).setVisible(false);
        this.timebarMargin = this.add.rectangle(300, 490, 300, 20).setStrokeStyle(4, 0xffffff).setOrigin(0, 0).setVisible(false);



        //stop the game
        this.time.delayedCall(107000, () => {
            this.isPlaying=false;
            this.arrows.forEach(el=>{
                el.destroy();
            })
            this.arrows=[];
            this.timebar.setVisible(false);
            this.timebarMargin.setVisible(false);


        })



        //dialogs at the end
        this.time.delayedCall(135000, () => {
            console.log("empiezan los diálogos")
            if (this.score > 5) {
                this.showDialogue("Huh, I must still be dreaming. This guy can’t be real. ", false, "Guy Blue")
            } else {
                this.showDialogue("Wuuh, I must still be dream—hicc*—ing. Thiiis guy can’t be real. ", false, "Guy Blue")
            }
        })

        this.time.delayedCall(138000, () => {
            if (this.score > 5) {
                this.showDialogue(" Hey bud, looks like you took a little doze there. ", false, "Red Guy")
            } else {
                this.showDialogue("Hey bud, looks like you took a little doze there.  ", false, "Red Guy")
            }
        })


        this.time.delayedCall(138000, () => {
            if (this.score > 5) {
                this.showDialogue("What the hell is going on?", false, "Guy Blue")
            } else {
                this.showDialogue("What the hElll is g-g-going on? ", false, "Guy Blue")
            }
        })


        this.time.delayedCall(141000, () => {
            if (this.score > 5) {
                this.showDialogue("Well I think there’s a show over at Silent Barn a little later.", false, "Red Guy")
            } else {
                this.showDialogue("Well I think there’s a show over at Silent Barn a little later.", false, "Red Guy")
            }
        })

        this.time.delayedCall(144000, () => {
            if (this.score > 5) {
                this.showDialogue("No, I mean what the fuck happened? Look around, this place is a dump. ", false, "Guy Blue")
            } else {
                this.showDialogue("N-N-No, I mean what the fuck—hicc*—happened? Look around, this place issSsssa dump-uh!! ", false, "Guy Blue")
            }
        })

        this.time.delayedCall(147000, () => {
            if (this.score > 5) {
                this.showDialogue("Yeah it’s a bit dive-y. I like that though. That’s getting harder to find in this neighborhood. ", false, "Red Guy")
            } else {
                this.showDialogue("Yeah it’s a bit dive-y. I like that though. That’s getting harder to find in this neighborhood. ", false, "Red Guy")
            }
        })

        this.time.delayedCall(150000, () => {
            if (this.score > 5) {
                this.showDialogue("You’re out of your mind. No, wait, I’m out of MY mind. This is all nuts. Ah, fuck it, want a beer? ", false, "Guy Blue")
            } else {
                this.showDialogue("Youuuu’re outt of your d-d-amn mind. No—hicc*— I’m outTta my mind. Thirrs issaaall nuts. Aaahh, F-Fuck it. Want-ta a beer? ", false, "Guy Blue")
            }
        })

        this.time.delayedCall(153000, () => {
            if (this.score > 5) {
                this.showDialogue("Please, thanks. ", false, "Red Guy")
            } else {
                this.showDialogue(" Please, thanks. ", false, "Red Guy")
            }
        })



        this.time.delayedCall(157000, () => {

        })



        this.time.delayedCall(159000, () => {
            if (this.score > 5) {
                this.showDialogue("So you said there’s a show tonight? At Silent Barn?", false, "Guy Blue")
            } else {
                this.showDialogue("GB: Sssooo you saird there’s a show-w tonight? —Hicc*— At Silent Barn? ", false, "Guy Blue")
            }
        })

        this.time.delayedCall(162000, () => {
            if (this.score > 5) {
                this.showDialogue("Yeah. I’m supposed to meet my friends there later. ", false, "Red Guy")
            } else {
                this.showDialogue("Yeah. I’m supposed to meet my friends there later. ", false, "Red Guy")
            }
        })


        this.time.delayedCall(165000, () => {
            if (this.score > 5) {
                this.showDialogue("And Silent Barn is in the same state as this place? ", false, "Guy Blue")
            } else {
                this.showDialogue("And Silent Barn is’n the same state—hicc*— as th-this place? ", false, "Guy Blue")
            }
        })


        this.time.delayedCall(168000, () => {
            if (this.score > 5) {
                this.showDialogue(" Yeah more or less. Are you new to Bluepoint?", false, "Red Guy")
            } else {
                this.showDialogue("Yeah more or less. Are you new to Bluepoint? ", false, "Red Guy")
            }
        })

        this.time.delayedCall(171000, () => {
            if (this.score > 5) {
                this.showDialogue("Feels like it. And your friends, I’m guessing they’re all like you? ", false, "Guy Blue")
            } else {
                this.showDialogue("S-sure feels liiike it. An-n-nd your frainnds, I’m guessing they’re all—hicc*— like you? ", false, "Guy Blue")
            }
        })

        this.time.delayedCall(174000, () => {
            if (this.score > 5) {
                this.showDialogue("We all have similar tastes and interests if that’s what you mean.", false, "Red Guy")
            } else {
                this.showDialogue("We all have similar tastes and interests if that’s what you mean. ", false, "Red Guy")
            }
        })

        this.time.delayedCall(177000, () => {
            if (this.score > 5) {
                this.showDialogue("Right…so you’re all nuts.", false, "Guy Blue")
            } else {
                this.showDialogue("Buuuurppp*—…y-yer all nutssss.", false, "Guy Blue")
            }
        })

        this.time.delayedCall(180000, () => {
            if (this.score > 5) {
                this.showDialogue(" Haha we’ve been called worse.", false, "Red Guy")
            } else {
                this.showDialogue("Haha we’ve been called worse.", false, "Red Guy")
            }
        })

    },

    update: function (t, delta) {

        this.playTime += delta;

        if (this.isPlaying) {
            if (this.timeForAnswer > 0) {
                this.timeForAnswer -= delta;
                this.timebar.width = (this.timeForAnswer / this.initialTime) * 300;
            } else {
                this.arrows.forEach(element => {
                    element.setTint(0xff0000);
                });

                this.isPlaying = false;
                this.time.delayedCall(500, () => {
                    this.arrows.forEach(element => {
                        element.destroy();
                    });

                    this.arrows = this.showSetArrows(this.score);
                    this.currentArrow = 0;
                    this.timebar.width = 300;
                    this.isPlaying = true;
                });
            }
        }


        let nearest = this.minDistance();
        if (nearest[0] < radiusInteraction) {
            this.buttonInteract.visible = true;
            this.buttonInteractText.visible = true;

            this.buttonInteractText.text = "check bottle";

        } else {

            this.buttonInteract.visible = false;
            this.buttonInteractText.visible = false;
        }


        if (this.joyStick != null) this.dumpJoyStickState();



    },

    dumpJoyStickState: function () {


        if (this.isPlaying) {
            if (Math.abs(this.joyStick.forceX) > 40 || Math.abs(this.joyStick.forceY) > 40) {
                if (!this.joyStickPressed) {
                    if (this.joyStick.forceX > 40) this.directionPressed(right);
                    else if (this.joyStick.forceX < -40) this.directionPressed(left);
                    else if (this.joyStick.forceY < -40) this.directionPressed(up);
                    else if (this.joyStick.forceY > 40) this.directionPressed(down);
                }
                this.joyStickPressed = true;
            } else {
                this.joyStickPressed = false
            }
        }
        //else if (!controls.joystickLocked)
        //player.moveJoystic(this.joyStick.forceX, this.joyStick.forceY)
    },

    hideDialogue(unlockControls) { // hide the current dialogue or goes to the next one in a sequential dialog

        if (unlockControls === undefined) unlockControls = true;

        this.showingDialogue = false;
        this.textTitle.visible = false;
        this.textDialogue.visible = false;
        this.textInstruction.visible = false;
        this.dialogueWindow.visible = false;
        if (unlockControls) controls.joystickLocked = false;


    },

    minDistance() { // compute the min distance between the player and the NPCS from the npc array
        return this.beerPoints.reduce((acc, val) => {
            if (distance(player.avatar.x, player.avatar.y, val[0], val[1]) < acc[0]) {
                acc[0] = distance(player.avatar.x, player.avatar.y, val[0], val[1]);
                acc[1] = val[2];
            }
            return acc;
        }, [999])
    },

    showDialogue(message, unlockControls, title) { // shows the dialogue window with a specific message

        if (unlockControls === undefined) unlockControls = true;
        if (title === undefined) title = "Guy Blue"

        if (message != null) {
            this.typingEffect(message, unlockControls);
            this.textTitle.text = title
        }
        this.showingDialogue = true;
        this.textTitle.visible = true;
        this.textDialogue.visible = true;
        this.textInstruction.visible = true;
        this.dialogueWindow.visible = true;
        player.returnToIdle();
        player.direction = null;
        player.moving = false;
        controls.joystickLocked = true;
    },


    interact() { //when button is pressed for interact, show the dialog

        let nearest = this.minDistance();

        if (nearest[0] < radiusInteraction) {
            this.showDialogue(nearest[1]);

        }

    },


    showSetArrows(score) {

        ArrowsScore = [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8];
        if (score > 15) N = 8;
        else N = ArrowsScore[score];

        //set the timer
        this.initialTime = (N * 2 - 0.28 * score) * 1000;
        this.timeForAnswer = this.initialTime;


        let namesArrows = ["level2_down", "level2_up", "level2_left", "level2_right"];
        let symbolArrows = [down, up, left, right];

        let initialX = 420 - (Math.floor((N - 2) / 2) * 71);


        let arrows = [];
        for (var i = 0; i < N; i++) {
            let randomInt = getRandomInt(4)
            let arrow = this.add.image(initialX + i * 70, 440, namesArrows[randomInt]).setOrigin(0.5).setDepth(20).setTint(0x0000ff);
            arrow.direction = symbolArrows[randomInt];
            arrows.push(arrow);
        }
        return arrows;
    },




    directionPressed(key) {
        if (!this.isPlaying) return
        if (this.arrows[this.currentArrow].direction == key) { // correct key in the sequence
            this.arrows[this.currentArrow].setTint(0x00ff00);
            this.currentArrow++;
        } else { //wrong key 
            this.arrows[this.currentArrow].setTint(0xff0000);
            this.isPlaying = false;
            this.time.delayedCall(500, () => {
                this.arrows.forEach(element => {
                    element.destroy();
                });

                this.arrows = this.showSetArrows(this.score);
                this.currentArrow = 0;
                this.timebar.width = 300;
                this.isPlaying = true;
            });
        }

        if (this.currentArrow >= this.arrows.length) { // completed all the sequence

            this.isPlaying = false;
            this.time.delayedCall(500, () => {
                this.arrows.forEach(element => {
                    element.destroy();
                });


                this.score++;
                this.scoreText.text = ("x " + this.score)

                this.arrows = this.showSetArrows(this.score);
                this.currentArrow = 0;
                this.timebar.width = 300;
                this.isPlaying = true;
            });
        }
    }

})
class trajectoryObject {
    constructor(triggerType) {
        this.triggerType = triggerType;
        self = this;
    }

    start(e){
        self.startTime = Date.now();
        START_BUT_DISAPPEAR();
        HIDE_CURSOR();
        self.pos = {x: e.offsetX - $('#canvas').offset().left, y: e.offsetY - $('#canvas').offset().top};
        self.startDraw();
        $('#metronome')[0].currentTime = 0;
        $('#metronome')[0].play();
    };

    recordRecognition() {
        SHOW_RECOGNITION_NEXT_BUT();
        var instrChoice = $('input[name="recognition"]:checked').val();
        if(instrChoice != undefined)
            self.recognition = instrChoice;
    }

    triggerDiskMove(type) {
        if(type == 'physical') {
            if (self.pos.x >= ($('#disk').position().left - PHYSICAL_TRIGGER_DIST)) {
                $('#metronome')[0].pause();
                SHOW_CURSOR();
                MOVE_DISK();
                setTimeout(SHOW_TRACING_NEXT_BUT, 1000);
                $('#recognition').change(self.recordRecognition);
                self.end_of_trajectory = true;
            }
        } else if (type == 'social') {
            if (self.pos.x >= ($('#disk').position().left - SOCIAL_TRIGGER_DIST)) {
                $('#metronome')[0].pause();
                SHOW_CURSOR();
                MOVE_DISK();
                setTimeout(SHOW_TRACING_NEXT_BUT, 1000);
                $('#recognition').change(self.recordRecognition);
                self.end_of_trajectory = true;
                self.drawAfterTrigger();
            }
        } else {
            if (self.pos.x >= ($('#disk').position().left - NO_TRIGGER_DIST)) {
                $('#metronome')[0].pause();
                SHOW_CURSOR();
                SHOW_TRACING_NEXT_BUT();
                $('#recognition').change(self.recordRecognition);
                self.end_of_trajectory = true;
            }
        }
    }
}
/*
    ####### ####### #     # ####### ######
    #     #    #    #     # #       #     #
    #     #    #    #     # #       #     #
    #     #    #    ####### #####   ######
    #     #    #    #     # #       #   #
    #     #    #    #     # #       #    #
    #######    #    #     # ####### #     #

 */
const SPATIAL_DEVIATION_LIMIT = 200;
const BPM = 80;
const TEMPO = 60000 / BPM;
const TURNING_POINT_INTERVAL = 5; //consider as a turning point if the distance between y of the mouse and the y of the peak/bottom is within this interval
const TEMPORAL_DEVIATION_LIMIT = 400;

class otherTrajectoryObject extends trajectoryObject{
    constructor(triggerType) {
        super(triggerType);
        this.index = 0;
        this.trajectory = OTHER_TRAJECTORY;
        this.time_elapsed = this.trajectory[0][0];
        this.initial_pos = this.trajectory.shift()[1];
        this.pos = this.initial_pos;
        this.end_of_trajectory = false;
        this.large_spatial_deviation = false;
        this.large_temporal_deviation = false;
        this.mousePos = this.initial_pos;
    }

    startDraw() {
        this.bindMouseMove();
    }

    bindMouseMove() {
        $(document).mousemove(function () {
            $(document).off('mousemove');
            self.startTrajectory();
        });
    }

    startTrajectory() {
        self.startTime = Date.now();
        self.draw();
    }

    draw() {
        $(document).mousemove(function (e) {
            $(document).off('mousemove');
            if(Math.abs(e.offsetY - 350) < TURNING_POINT_INTERVAL || Math.abs(e.offsetY - 450) < TURNING_POINT_INTERVAL)
                self.checkTemporalDeviation($('#metronome')[0].currentTime * 1000);
            self.mousePos = {'x': e.offsetX, 'y': e.offsetY};
            self.checkSpatialDeviation();
            const TIME_ELAPSED = Date.now() - self.startTime;
            self.nextMove = [];
            self.nextMove = self.findNextMove(TIME_ELAPSED);

            ctx.beginPath();
            for(let i=0; i<self.nextMove.length; i++) {
                ctx.moveTo(self.pos.x, self.pos.y);
                self.pos.x = self.nextMove[i][1]['x'];
                self.pos.y = self.nextMove[i][1]['y'];
                ctx.lineTo(self.pos.x, self.pos.y);
                ctx.stroke();
            }
            self.triggerDiskMove(self.triggerType);
            if (!self.end_of_trajectory && !self.large_spatial_deviation && !self.large_temporal_deviation) {
                requestAnimationFrame(self.draw);
            } else if (self.large_spatial_deviation) {
                self.interrupt_for_spatial_error();
            } else if (self.large_temporal_deviation) {
                self.interrupt_for_temporal_error();
            } else {
                // next trial
            }
        });
    }

    drawAfterTrigger() {
        ctx.strokeStyle = "#F08080";
        this.draw();
    }

    findNextMove(time_elapsed) {
        let next_timestamp = self.trajectory.shift();
        self.nextMove.push(next_timestamp);
        if (self.next_Move < time_elapsed) {
            self.findNextMove(time_elapsed);
        } else {
            return self.nextMove;
        }
    }

    checkTemporalDeviation(turningTime) {
        var temporalDeviation = Math.min(turningTime % TEMPO, Math.abs(TEMPO - turningTime % TEMPO));
        if (temporalDeviation > TEMPORAL_DEVIATION_LIMIT) {
            self.large_temporal_deviation = true;
            console.log('temporalDeviation =', temporalDeviation);
        }
    }

    checkSpatialDeviation() {
        const PX_TO_GRAPH = (1.5 * Math.PI) / 100;
        const GRAPH_TO_PX = 1 / PX_TO_GRAPH;
        var x = (self.mousePos.x - 100) * PX_TO_GRAPH - 0.5 * Math.PI;
        var y = (350 - self.mousePos.y) * PX_TO_GRAPH - 0.75 * Math.PI;
        var sinOfX = (3 * Math.PI / 4 * Math.sin(x));
        var spatialDeviation = Math.abs(y - sinOfX) * GRAPH_TO_PX;
        if (spatialDeviation > SPATIAL_DEVIATION_LIMIT) {
            self.large_spatial_deviation = true;
            console.log("spatialDeviation =", spatialDeviation)
        }
    }

    interrupt_for_spatial_error() {
        SHOW_CURSOR();
        SHOW_TRACING_NEXT_BUT();
        $('#metronome')[0].pause();
        alert("interrupt for spatial error");
        $('#recognition').change(self.recordRecognition);
    }

    interrupt_for_temporal_error() {
        SHOW_CURSOR();
        SHOW_TRACING_NEXT_BUT();
        $('#metronome')[0].pause();
        alert("interrupt for temporal error");
        $('#recognition').change(self.recordRecognition);
    }
}



/*
  #####  ####### #       #######
 #     # #       #       #
 #       #       #       #
  #####  #####   #       #####
       # #       #       #
 #     # #       #       #
  #####  ####### ####### #

*/

class selfTrajectoryObject extends trajectoryObject{
    constructor(triggerType) {
        super(triggerType);
        this.selfTrajectory = {};
    }

    startDraw() {
        $(document).mousemove(self.draw);
    }

    draw(e) {
        ctx.beginPath();

        ctx.moveTo(self.pos.x, self.pos.y);
        var currentTime = Date.now();
        var timeStamp = (currentTime - self.startTime)/1000;
        self.record(timeStamp, {x: self.pos.x, y: self.pos.y});
        self.updatePos(e);
        ctx.lineTo(self.pos.x, self.pos.y);

        ctx.stroke();
        self.triggerDiskMove(self.triggerType);
    }

    updatePos(e) {
        self.pos.x = e.offsetX;
        self.pos.y = e.offsetY;
    }

    record(timeStamp, pos) {
        this.selfTrajectory[timeStamp] = pos;
        console.log(this.selfTrajectory);
    }

}


/*
 ####### #     # #     #  #####
 #       #     # ##    # #     #
 #       #     # # #   # #
 #####   #     # #  #  # #
 #       #     # #   # # #
 #       #     # #    ## #     #
 #        #####  #     #  #####

*/

function REQUEST_TIMEOUT(to_do, delay) {
    const START_TIME = Date.now();
    function loop() {
        const TIME_ELAPSED = (Date.now() - START_TIME) / 1000;
        if (TIME_ELAPSED >= delay) {
            to_do();
        } else {
            request_id = requestAnimationFrame(loop);
            REGISTER_CANCEL_FUNCTION(function() {cancelAnimationFrame(request_id)});
        }
    }
    var request_id = requestAnimationFrame(loop);
    REGISTER_CANCEL_FUNCTION(function() {cancelAnimationFrame(request_id)});
}

function REQUEST_CANCEL() {
    // register automatically
}

function REGISTER_CANCEL_FUNCTION (func) {
    REQUEST_CANCEL = func;
}

function VECTOR_LENGTH(x_diff, y_diff) {
    return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
}
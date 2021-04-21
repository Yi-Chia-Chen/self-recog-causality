// Yi-Chia Chen

class gameObject {
    constructor(options = {}) {
        Object.assign(this, {
            canvasElement: false,
            lineWidth: 0,
            lineCap: 'round',
            lineColor: 'red',
            frozenLineColor: 'gray',
            sinewave: false,
            peakValleyN: 0,
            sinewaveWaveWidth: 0,
            mark: false,
            object: false,
            objectSpeed: 0,
            destinationX: 0,
            destinationY: 0,
            destinationRadius: 0,
            turningPointXs: [],
            soundElement: false,
            triggerDistDict: {},
            orientation: 0,
            bpm: 0,
            spatialDeviationLimit: 600,
            temporalDeviationLimit: 1,
            recognitionQElement: false,
            interruptCallback: false,
            gameEndCallback: false,
        }, options);
        this.width = this.canvasElement.width();
        this.height = this.canvasElement.height();
        this.area = {'w': this.width, 'h': this.height};
        this.xPadding = (this.width-this.sinewaveWaveWidth) / 2;
        this.context = this.canvasElement[0].getContext('2d');
        this.context.canvas.width = this.width;
        this.context.canvas.height = this.height;
        this.context.lineWidth = this.lineWidth;
        this.context.lineCap = this.lineCap;
        this.context.strokeStyle = this.lineColor;
        this.markX = parseInt(this.mark.css('left'), 10);
        this.markY = parseInt(this.mark.css('top'), 10);
        this.markWidth =  this.mark.width();
        this.markHeight =  this.mark.height();
        this.markCenterX = this.markX + this.markWidth/2;
        this.markCenterY = this.markY + this.markHeight/2;
        this.objectWidth =  this.object.width();
        this.objectHeight =  this.object.height();
        this.objectInitialX = parseInt(this.object.css('left'), 10);
        this.objectInitialY = parseInt(this.object.css('top'), 10);
        this.objectInitialCenterX = this.objectInitialX + this.objectWidth/2;
        this.objectInitialCenterY = this.objectInitialY + this.objectHeight/2;
        this.beatInterval = 60/this.bpm;
        this.spatiallyDeviated = false;
        this.temporallyDeviated = false;
    }

    rotatePos(ori, vector) {
        const CENTERED = MOVE_ORIGIN_FROM_TOP_LEFT_TO_CENTER(vector, this.area);
        const ROTATED = TWO_D_VECTOR_ROTATION(ori, CENTERED);
        return MOVE_ORIGIN_FROM_CENTER_TO_TOP_LEFT(ROTATED, this.area);
    }

    unrotatePos(ori, vector) {
        const CENTERED = MOVE_ORIGIN_FROM_TOP_LEFT_TO_CENTER(vector, this.area);
        const ROTATED = TWO_D_VECTOR_ROTATION(-ori, CENTERED);
        return MOVE_ORIGIN_FROM_CENTER_TO_TOP_LEFT(ROTATED, this.area);
    }

    update(this_game) {
        this.workingTurningPointXs = this.turningPointXs.slice();
        this.nextTurningPoint = this.workingTurningPointXs.shift();
        this.selfTrajectory = [];
        this.spatiallyDeviated = false;
        this.temporallyDeviated = false;
        this.maxSpatialDeviationX = 0;
        this.maxSpatialDeviationY = 0;
        this.maxTemporalDeviation = 0;
        this.waitingForTraceEnd = true;

        this.triggerType = this_game['triggerType'];
        this.traceType = this_game['traceType'];
        this.otherTrajectory = this_game['otherTrajectory'];
        this.orientation = this_game['orientation'];

        const IMG_ORI = (-this.orientation).toString();
        this.sinewave.css({'transform': 'rotate('+IMG_ORI+'deg)'});
        this.actualMarkCenterPos = this.rotatePos(this.orientation, {x:this.markCenterX, y:this.markCenterY});
        this.otherlastPos = {
            x: this.actualMarkCenterPos.x,
            y: this.actualMarkCenterPos.y
        }
        const ACTUAL_MARK_X = this.actualMarkCenterPos.x-this.markWidth/2;
        const ACTUAL_MARK_Y = this.actualMarkCenterPos.y-this.markHeight/2;
        this.mark.css({'left': ACTUAL_MARK_X+'px', 'top': ACTUAL_MARK_Y});
        this.mark.show();
        this.objectX = this.objectInitialX;
        this.objectY = this.objectInitialY;
        const OBJECT_CENTER_POS = this.rotatePos(this.orientation, {x:this.objectInitialCenterX, y:this.objectInitialCenterY});
        const OBJECT_X = OBJECT_CENTER_POS.x - this.objectWidth/2;
        const OBJECT_Y = OBJECT_CENTER_POS.y - this.objectHeight/2;
        this.object.css({'left': OBJECT_X+'px', 'top': OBJECT_Y+'px'});
        this.objectActualXSpeed = Math.abs(this.objectSpeed*Math.cos(TO_RADIANS(this.orientation)));
        this.objectActualYSpeed = Math.abs(this.objectSpeed*Math.sin(TO_RADIANS(this.orientation)));
        this.objectActualXDistToBorder = Math.min(Math.abs(OBJECT_X), this.width-this.objectWidth-Math.abs(OBJECT_X));
        this.objectActualYDistToBorder = Math.min(Math.abs(OBJECT_Y), this.height-this.objectHeight-Math.abs(OBJECT_Y));
        this.staticEndTime = Math.min(this.objectActualXDistToBorder/this.objectActualXSpeed, this.objectActualYDistToBorder/this.objectActualYSpeed);
        this.actualDestination = this.rotatePos(this.orientation, {x:this.destinationX, y:this.destinationY});

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.strokeStyle = this.lineColor;
        this.soundElement.currentTime = 0;
        let that = this;
        $(window).mousemove(function(e){
            that.updatePos(e, that);
        });
    }

    start(game_start_time) {
        this.mark.hide();
        $('body').css('cursor', 'none');
        this.startDelay = (Date.now() - game_start_time)/1000;
        this.startTime = Date.now();
        this.soundElement.play();
        this.lastPos = {
            x: this.pos.x,
            y: this.pos.y
        };
        this.startPos = {
            x: this.lastPos.x,
            y: this.lastPos.y
        };
        const STANDARDIZED_START_POS = this.unrotatePos(this.orientation, {x:this.startPos.x, y:this.startPos.y});
        this.startDeviationX = STANDARDIZED_START_POS['x'] - this.markCenterX;
        this.startDeviationY = STANDARDIZED_START_POS['y'] - this.markCenterY;
        this.context.beginPath();
        this.selfTrajectory.push({
            t: this.startTime,
            x: STANDARDIZED_START_POS['x'],
            y: STANDARDIZED_START_POS['y']
        });
        this.triggered = false;
        this.objectEnd = false;
        this.traceEnd = false;
        let that = this;
        requestAnimationFrame(function(timestamp) {
            that.step(timestamp, that);
        });
    }

    updatePos(e, that) {
        that.pos = {
            x: e.pageX - that.canvasOffsetLeft,
            y: e.pageY - that.canvasOffsetTop
        };
    }

    step(timestamp, that) {
        if (!that.traceEnd) {
            that.checkToDraw();
        }
        that.updateDistToDestination();
        that.checkToTrigger();
        that.checkToContinue();
    }

    checkToDraw() {
        if (this.traceType == 'self'){
            this.posForCheck = this.selfDraw();
        } else {
            this.posForCheck = this.otherDraw();
        }
    }

    checkToTrigger() {
        if (!this.triggered) {
            this.triggered = this.checkIfTrigger();
            if (this.triggered) {
                this.triggerTime = Date.now();
                this.startToTriggerDuration = this.triggerTime - this.startTime;
            }
        }
        if (this.triggered && !this.objectEnd) {
            this.objectMove();
        }
    }

    checkToContinue() {
        this.traceEnd = this.checkIfTraceEnd();
        if (this.traceEnd && this.waitingForTraceEnd) {
            this.waitingForTraceEnd = false;
            this.soundElement.pause();
            this.traceRT = Date.now() - this.startTime;
            this.endDeviationX = this.lastPos.x - this.actualDestination.x;
            this.endDeviationY = this.lastPos.y - this.actualDestination.y;
            this.context.strokeStyle = this.frozenLineColor;
            for (let i=0;i<100;i++) { // for some reasons this is needed to change strokeStyle
                this.context.moveTo(this.lastPos.x, this.lastPos.y);
                this.lastPos.x += 0.001;
                this.context.lineTo(this.lastPos.x, this.lastPos.y);
                this.context.stroke();
            }
            // this.context.moveTo(this.lastPos.x, this.lastPos.y);
            // this.context.lineTo(this.actualDestination.x, this.actualDestination.y);
            // this.context.stroke();
        }
        if (this.objectEnd && this.traceEnd) {
            this.recognitionStart();
        } else {
            this.standardizedPosForCheck = this.unrotatePos(this.orientation, this.posForCheck);
            this.spatiallyDeviated = this.checkSpatialDeviation();
            this.temporallyDeviated = this.checkTemporalDeviation();
            if (this.spatiallyDeviated) {
                this.soundElement.pause();
                $('body').css('cursor', 'default');
                this.interruptCallback('spatial');
            } else if (this.temporallyDeviated) {
                this.soundElement.pause();
                $('body').css('cursor', 'default');
                this.interruptCallback('temporal');
            } else {
                let that = this;
                requestAnimationFrame(function(timestamp) {
                    that.step(timestamp, that);
                });
            }
        }
    }

    selfDraw() {
        this.context.moveTo(this.lastPos.x, this.lastPos.y);
        this.timeStamp = (Date.now() - this.startTime)/1000;
        this.soundTime = this.soundElement.currentTime;
        this.lastPos = {x:this.pos.x, y:this.pos.y};
        this.context.lineTo(this.lastPos.x, this.lastPos.y);
        this.context.stroke();
        const STANDARDIZED_LAST_POS = this.unrotatePos(this.orientation, this.lastPos);
        this.selfTrajectory.push({
            t: this.timeStamp,
            x: STANDARDIZED_LAST_POS.x,
            y: STANDARDIZED_LAST_POS.y
        });
        return this.lastPos;
    }

    otherDraw() {
        this.timeStamp = (Date.now() - this.startTime)/1000;
        this.soundTime = this.soundElement.currentTime;
        this.lastPos = {x:this.pos.x, y:this.pos.y};
        const STANDARDIZED_LAST_POS = this.unrotatePos(this.orientation, this.lastPos);
        this.selfTrajectory.push({
            t:this.timeStamp,
            x: STANDARDIZED_LAST_POS.x,
            y: STANDARDIZED_LAST_POS.y
        });
        this.nextOtherSteps = [];
        this.findNextMove();
        for(let i=0; i<this.nextOtherSteps.length; i++) {
            this.context.moveTo(this.otherlastPos.x, this.otherlastPos.y);
            this.otherlastPos = {
                x: this.nextOtherSteps[i].x,
                y: this.nextOtherSteps[i].y
            };
            this.context.lineTo(this.otherlastPos.x, this.otherlastPos.y);
            this.context.stroke();
        }
        return this.otherlastPos;
    }

    findNextMove() {
        const NOW_STEP = this.otherTrajectory.shift();
        const NOW_TIMESTAMP = NOW_STEP['t'];
        const NOW_POS = {
            x: NOW_STEP['x'],
            y: NOW_STEP['y']
        };
        const NOW_ACTUAL_POS = this.rotatePos(this.orientation, NOW_POS);
        const NOW_ACTUAL_X = NOW_ACTUAL_POS.x;
        const NOW_ACTUAL_Y = NOW_ACTUAL_POS.y;
        this.nextOtherSteps.push({x: NOW_ACTUAL_X, y: NOW_ACTUAL_Y});
        if (this.timeStamp > NOW_TIMESTAMP) {
            this.findNextMove();
        }
    }

    updateDistToDestination() {
        this.distToDestination = DISTANCE_BETWEEN_POINTS([this.posForCheck.x, this.posForCheck.y], [this.actualDestination.x, this.actualDestination.y]);
    }

    checkIfTrigger() {
        if (this.triggered) return true;
        if (this.distToDestination <= this.triggerDistDict[this.triggerType]) return true;
        return false;
    }

    checkIfTraceEnd() {
        if (this.traceEnd) return true;
        if (this.distToDestination <= this.destinationRadius) return true;
        return false;
    }

    objectMove() {
        this.elapsedTime = (Date.now()-this.triggerTime)/1000;
        this.actualObjectPos = this.rotatePos(this.orientation, {x:this.objectX, y:this.objectY});
        const OBJECT_REACHED = (
            (this.actualObjectPos.x <= 0) ||
            (this.actualObjectPos.x >= this.width-this.objectWidth) ||
            (this.actualObjectPos.y <= 0) ||
            (this.actualObjectPos.y >= this.height-this.objectHeight)
            );
        const OBJECT_STAYED_LONG_ENOUGH = (this.triggerType=='static') && (this.elapsedTime>=this.staticEndTime);
        if (OBJECT_REACHED || OBJECT_STAYED_LONG_ENOUGH) {
            this.objectEnd = true;
            this.objectMoveDuration = this.elapsedTime;
        } else if (this.triggerType=='static') {
            return;
        } else {
            this.objectX = this.objectInitialX + this.objectSpeed*this.elapsedTime;
            this.objectCenterX = this.objectX + this.objectWidth/2;
            const OBJECT_CENTER_POS = this.rotatePos(this.orientation, {x:this.objectCenterX, y:this.objectInitialCenterY});
            const OBJECT_X = OBJECT_CENTER_POS['x'] - this.objectWidth/2;
            const OBJECT_Y = OBJECT_CENTER_POS['y'] - this.objectHeight/2;
            this.object.css({'left': OBJECT_X+'px', 'top': OBJECT_Y+'px'});
        }
    }

    checkSpatialDeviation() {
        if(this.checkSpatialDeviationX()) return true;
        return this.checkSpatialDeviationY();
    }

    updateSpatialDeviationX() {
        const BEAT_COUNT_AFTER_FIRST = this.soundTime/this.beatInterval;
        const CORRECT_PROGRESS = BEAT_COUNT_AFTER_FIRST / (this.peakValleyN-1);
        const STANDARDIZED_CORRECT_X = CORRECT_PROGRESS*this.sinewaveWaveWidth + this.xPadding;
        this.xDeviation = Math.abs(this.standardizedPosForCheck.x - STANDARDIZED_CORRECT_X);
    }

    checkSpatialDeviationX() {
        this.updateSpatialDeviationX();
        this.maxSpatialDeviationX = Math.max(this.xDeviation, this.maxSpatialDeviationX);
        if (this.xDeviation > this.spatialDeviationLimit) return true;
        return false;
    }

    updateSpatialDeviationY() {
        const STANDARDIZED_CORRECT_Y = SINEWAVE_FUNCTION(this.standardizedPosForCheck.x);
        this.yDeviation = Math.abs(this.standardizedPosForCheck.y - STANDARDIZED_CORRECT_Y);
    }

    checkSpatialDeviationY() {
        this.updateSpatialDeviationY();
        this.maxSpatialDeviationY = Math.max(this.yDeviation, this.maxSpatialDeviationY);
        if (this.yDeviation > this.spatialDeviationLimit) return true;
        return false;
    }

    checkTemporalDeviation() {
        if (this.standardizedPosForCheck.x >= this.nextTurningPoint) {
            this.nextTurningPoint = this.workingTurningPointXs.shift();
            const TIME_TO_NEXT = this.soundTime % this.beatInterval;
            this.temporalDeviation = Math.min(TIME_TO_NEXT, this.beatInterval-TIME_TO_NEXT);
            this.maxTemporalDeviation = Math.max(this.temporalDeviation, this.maxTemporalDeviation);
            if (this.temporalDeviation > this.temporalDeviationLimit) return true;
            return false;
        }
        return false;
    }

    recognitionStart() {
        $(document).off('mousemove');
        this.recognitionQElement.show();
        this.startToObjectEndRT = Date.now() - this.startTime;
        this.recognitionStartTime = Date.now();
        let that = this;
        $(document).keyup(function(e) {
            if (e.code == 'KeyY' || e.code == 'KeyN') {
                $(document).off('keyup');
                that.recognitionQElement.hide();
                that.recognitionRT = (Date.now() - that.recognitionStartTime)/1000;
                that.recognition = e.code;
                $('body').css('cursor', 'default');
                that.gameEndCallback();
            }
        });
    }
}
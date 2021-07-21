function getMatrixColumn(matrix, columnNumber){
    const arrColuna = []
    matrix.forEach(array => array.forEach((elemento, index) => {
        if(index == columnNumber)
            arrColuna.push(elemento)
    }))
    return arrColuna
}

function getSquare(matrix, slot){
    const arrSquare = []
    matrix.forEach(array => array.forEach(elemento => {
        if(Math.floor(elemento.getX() / 3) == Math.floor(slot.getX() / 3) 
        && Math.floor(elemento.getY() / 3) == Math.floor(slot.getY() / 3)){
            arrSquare.push(elemento)
        }
    }))
    return arrSquare
}


function wait(ms) {
    let start = Date.now(),
    now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

function getSquareNumerical(matrix, x, y){
    const arrSquare = []
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(Math.floor(j / 3) == Math.floor(x / 3) && Math.floor(i / 3) == Math.floor(y / 3)){
                arrSquare.push(matrix[i][j])
            }
        }
    }
    return arrSquare
}





class SudokuGame {


    constructor(){
        this.tag = document.querySelector('#sudoku-board')
        this.numericalMatrix = this.createSlots(false)
        this.tagMatrix = this.createSlots()
        this.selectedSlot = null;
        this.tag.onclick = () => this.changeSelectedSlot()
        document.onclick = (e) => this.checkOutsideClick(e)
        // this.printCount = 0
        document.querySelector('#solve').onclick = () => this.solveNumMatrix()
        this.matrixLockedFlag = 0
        document.onkeypress = (e) => this.checkToFillSlot(e)
        document.querySelector('#clear').onclick = () => this.clearMatrix()
        this.animationMovesArray = []
        this.isAnimating = 0
    }
    
    clearMatrix(){
        
        if(this.isAnimating)
            return

        this.matrixLockedFlag = 0
        const allSlots = this.tagMatrix.flat(Infinity)
        allSlots.forEach(element => {
            element.fillSlot(0)
            element.clearSlot()
        })
        this.numericalMatrix.forEach(array => {
            for(let i = 0; i < 9; i++)
                array[i] = 0
        })
        this.numericalMatrix.forEach(array => console.log(array))
    }

    trySolveMatrix(){
        this.solveNumMatrix()
        if(!this.matrixLockedFlag){
            this.sudokuImpossible()
        }
    }

    checkOutsideClick(e){
        // const insidePossibilities = document.querySelectorAll('#sudoku-board, #sudoku-board *')
        // let clickWasOutside = false
        // console.log(e.target)
        if(!(this.tag == e.target || this.tag.contains(e.target)))
            this.unselectSlots()
            // console.log('HEY')
    }

    unselectSlots(){
        this.selectedSlot = null
        this.tagMatrix.forEach(array => array.forEach(elemento => {
            if(elemento.isObserved()){
                elemento.removeHighlightObserved()
            }
            if(elemento.isSelected()){
                elemento.unselect()
            }
        }))
    }

    createSlots(tagFlag = true){
        const matrix = []
        for(let i = 0; i < 9; i++){
            matrix.push([])
            for(let j = 0; j < 9; j++){
                if(tagFlag)
                    matrix[i].push(new SudokuSlot(this.tag, i, j, this.numericalMatrix))
                else
                    matrix[i].push(0)
            }
        }
        return matrix
    }

    changeSelectedSlot(){
        const originalSelected = this.selectedSlot
        if(this.selectedSlot){
            this.selectedSlot.unselect()
        }
        this.selectedSlot = this.findSelected() || originalSelected
        this.highlightObservedSlots()
        this.selectedSlot.select()

        // console.log(this.selectedSlot)
    }

    highlightArray(array){
        array.forEach(elemento => {
            elemento.hightlightObserved()
        })
    }

    highlightObservedSlots(){
        this.tagMatrix.forEach(array => array.forEach(elemento => {
            if(elemento.isObserved()){
                elemento.removeHighlightObserved()
            }
        }))
        this.highlightArray(getMatrixColumn(this.tagMatrix, this.selectedSlot.getX()))
        this.highlightArray(this.tagMatrix[this.selectedSlot.getY()])
        this.highlightArray(getSquare(this.tagMatrix, this.selectedSlot))
    }

    findSelected(){
        let selectedSlot = null
        this.tagMatrix.forEach(array => array.forEach(elemento => {
            if(elemento.isSelected())
                selectedSlot = elemento
        }))
        return selectedSlot
    }

    numValueIsPossible(value, x, y){
        const allObserved = [getMatrixColumn(this.numericalMatrix, x), this.numericalMatrix[y],
                            getSquareNumerical(this.numericalMatrix, x, y)].flat(Infinity)
         
         for(let i = 0; i < allObserved.length; i++){
            if(allObserved[i] == value)
                return false
        }
        return true
    }



    tagValueIsPossible(slot, value){
        const allObserved = [getMatrixColumn(this.tagMatrix, slot.getX()),
                            this.tagMatrix[slot.getY()],
                            getSquare(this.tagMatrix, slot)].flat(Infinity)
        
        for(let i = 0; i < allObserved.length; i++){
            if(allObserved[i].getValue() == value)
                return false
        }
        return true
    }

    solveNumMatrix(print = 1){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){

                if(this.numericalMatrix[i][j] == 0){
                    // const currentSlot = this.numericalMatrix[i][j]
                    
                    for(let k = 1; k <= 9 && !this.matrixLockedFlag; k++){
                        
                        if(this.numValueIsPossible(k, j, i)){
                            
                            
                            
                            // new Promise((resolve) => {
                            //     wait(10)
                            //     resolve()
                            // })
                            // .then(() => currentSlot.fillSlot(k))
                            // .then(() => currentSlot.greenBorder())
                            // .then(() => this.solveNumMatrix())
                            // .then(() => {
                            //     if(!this.matrixLockedFlag){
                            //         currentSlot.fillSlot(0)
                            //         currentSlot.redBorder()
                            //     }
                            // })
                            this.numericalMatrix[i][j] = k
                            this.animationMovesArray.push(`${i}${j}${k}`)

                            this.solveNumMatrix()
                            if(!this.matrixLockedFlag){
                                // currentSlot.fillSlot(0)
                                this.numericalMatrix[i][j] = 0
                                // currentSlot.redBorder()
                                this.animationMovesArray.push(`${i}${j}0`)
                            }
                            // currentSlot.fillSlot(k)
                            // currentSlot.greenBorder()
                            // this.solveNumMatrix()
                            // if(!this.matrixLockedFlag){
                            //     currentSlot.fillSlot(0)
                            //     currentSlot.redBorder()
                            // }
                        }
                    
                    }
                    return 
                }
            }
        }
        
        if(print)
            this.printOutSolution()
        this.matrixLockedFlag = 1
        return 
    }

    printOutSolution(){
        this.isAnimating = 1
        let currentAction = this.animationMovesArray.shift()
        const currentSlot = this.tagMatrix[currentAction[0]][currentAction[1]]
        let value = parseInt(currentAction[2])
        value > 0 ? currentSlot.greenBorder() : currentSlot.redBorder()
        currentSlot.fillSlot(value)
        if(this.animationMovesArray.length > 0){
            setTimeout(() => this.printOutSolution(), 10)
        } else{
            this.isAnimating = 0
        }
    }


    selectNext(){
        for(let i = this.selectedSlot.getY(); i < 9; i++){ 
            let j
            if(i == this.selectedSlot.getY())
                j = this.selectedSlot.getX()
            else 
                j = 0   
            for(j; j < 9; j++){
                if(this.tagMatrix[i][j].getValue() == 0){
                    this.tagMatrix[i][j].select()
                    this.changeSelectedSlot()
                    return
                }
            }
        }
    }


    checkToFillSlot(event){
        if(this.selectedSlot == null || this.isAnimating)
            return
        let key;
        key = event.keyCode - 48
        if(!(key > 0 && key < 10))
            return
        if(this.selectedSlot.getValue() == 0 &&  this.tagValueIsPossible(this.selectedSlot, key)){
            this.selectedSlot.fillSlot(key)
            this.selectNext()
        }
    }


}



class SudokuSlot{
    constructor(tagBoard, yPosition, xPosition, numMatrix){
        this.valuesMatrix = numMatrix
        this.boardTag = tagBoard
        this.tag = document.createElement('div')
        this.tag.classList.add('slot')
        this.boardTag.appendChild(this.tag)
        // this.frameTag = document.createElement('div')
        // this.frameTag.classList.add('frame')
        // this.tag.appendChild(this.frameTag)
        this.x = xPosition
        this.y = yPosition
        this.value = 0
        this.putBorders()
        this.tag.onclick = () => this.select()
    }

    putBorders(){
        if(this.x % 3 == 0){
            this.tag.classList.add('thick-left')
        }
        if(this.x % 3 == 2){
            this.tag.classList.add('thick-right')
        }
        if(this.y % 3 == 0){
            this.tag.classList.add('thick-top')
        }
        if(this.y % 3 == 2){
            this.tag.classList.add('thick-bottom')
        }
    }

    fillSlot(newValue){
        if(newValue == 0){
            this.tag.innerHTML = ''
            this.value = 0
            this.valuesMatrix[this.getY()][this.getX()] = 0
        }
        else{
            this.tag.innerHTML = `${newValue}`
            this.value = newValue
            this.valuesMatrix[this.getY()][this.getX()] = newValue
        }
    }

    getX(){
        return this.x
    }

    getY(){
        return this.y
    }

    getValue(){
        return this.value
    }


    select(){
        this.removeHighlightObserved()
        this.tag.classList.add('selected-slot')
    }

    unselect(){
        this.tag.classList.remove('selected-slot')
    }

    isSelected(){
        return this.tag.classList.contains('selected-slot')
    }

    hightlightObserved(){
        if(!this.isObserved())
            this.tag.classList.add('observed-slot')
    }

    removeHighlightObserved(){
        this.tag.classList.remove('observed-slot')
    }

    isObserved(){
        return this.tag.classList.contains('observed-slot')
    }

    greenBorder(){
        if(this.tag.classList.contains('unfilled'))
            this.tag.classList.remove('unfilled')
        this.tag.classList.add('filled')
    }

    redBorder(){
        // console.log(this.getValue())
        
        if(this.tag.classList.contains('filled'))
            this.tag.classList.remove('filled')
        this.tag.classList.add('unfilled')
    }

    clearSlot(){
        this.tag.classList.remove('filled')
        this.tag.classList.remove('unfilled')
    }
}


const game = new SudokuGame()
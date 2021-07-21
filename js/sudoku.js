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



function randomizeArray(array){
    const auxArr = []
    let size = array.length
    while(size > 0){
        auxArr.push(array.splice(Math.random() * size, 1)[0])
        size--
    }
    while(auxArr.length > 0){
        array.push(auxArr.pop())
    }
}



function existsEmptySlot(matrix){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(matrix[i][j] == 0)
                return 1
        }
    }
    return 0
}




function randomRowOrColumn(){
    return Math.floor(Math.random() * 9)
}


function matrixCopy(matrix){
    const returnMatrix = []
    for(let i = 0; i < matrix.length; i++){
        returnMatrix.push([])
        for(let j = 0; j < matrix[0].length; j++){
            returnMatrix[i].push(matrix[i][j])
        }
    }
    return returnMatrix
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
        document.querySelector('#solve').onclick = () => this.solve()
        this.matrixLockedFlag = 0
        document.onkeydown = (e) => this.checkToFillSlot(e)
        document.querySelector('#clear').onclick = () => this.clearMatrix()
        this.animationMovesArray = []
        this.isAnimating = 0
        
        // this.checkMatrix = this.createSlots(false)

        // randomizeArray([1,2,3,4,5,6,7,8,9])
        
        document.querySelector('#generate').onclick = () => this.fillBoard(this.generatePuzzle())
    }
    
    solve(){
        this.solveNumMatrix()
        if(!this.matrixLockedFlag){
            alert('UNSOLVABLE SUDOKU!')
        }
    }

    fillBoard(matrix){
        // thimatrix
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                this.tagMatrix[i][j].fillSlot(matrix[i][j])
            }
        }
    }

    fillSudoku(matrix, settingsObject = { checkNumSolutions: false, numSolutions: 0 }, rand = 0){
        
        
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        
        if(rand)
            randomizeArray(numbers)
        
        let finishedFlag = 0
        
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                        
                if(matrix[i][j] == 0){
                    
                    for(let k = 1; k <= 9 && !finishedFlag; k++){
                        
                        if(this.numValueIsPossible(matrix, numbers[k - 1], j, i)){
                            matrix[i][j] = numbers[k - 1]
                            finishedFlag = this.fillSudoku(matrix, settingsObject)
                            if(!finishedFlag){
                                matrix[i][j] = 0
                            }
                        }
                    }
                    return finishedFlag
                }
            }
        }
        
        if(settingsObject.checkNumSolutions == true){
            settingsObject.numSolutions++;
            return 0;
        }
        return 1
    }




    generatePuzzle(){

        this.clearMatrix()

        const matrix = this.createSlots(false)
        const attemptsMatrix = this.createSlots(false)

        this.fillSudoku(matrix,{ checkNumSolutions: false }, 1)
        
        let randX = randomRowOrColumn()
        let randY = randomRowOrColumn()
        
        let curValue = 0
        
        const solutionsObject = { checkNumSolutions: true, numSolutions: 1 }

        
        while(solutionsObject.numSolutions <= 1){

            solutionsObject.numSolutions = 0

            curValue = matrix[randY][randX]
            if(attemptsMatrix[randY][randX] == 0)
                matrix[randY][randX] = 0

            this.fillSudoku(matrixCopy(matrix), solutionsObject)
            
            if(solutionsObject.numSolutions > 1){
                matrix[randY][randX] = curValue
                attemptsMatrix[randY][randX] = 1
            }

            randX = randomRowOrColumn()
            randY = randomRowOrColumn()
        }
        return matrix
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

        while(this.animationMovesArray.length > 0){
            this.animationMovesArray.shift()
        }
    }

    trySolveMatrix(){
        this.solveNumMatrix()
        if(!this.matrixLockedFlag){
            this.sudokuImpossible()
        }
    }

    checkOutsideClick(e){
        if(!(this.tag == e.target || this.tag.contains(e.target)))
            this.unselectSlots()
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
                else{
                    matrix[i].push(0)
                }
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

    numValueIsPossible(matrix, value, x, y){
        const allObserved = [getMatrixColumn(matrix, x), matrix[y], getSquareNumerical(matrix, x, y)].flat(Infinity)
         
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

    solveNumMatrix(print = 1, rand = 0){
        
        let result = 0
        

        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){

                if(this.numericalMatrix[i][j] == 0){
                    
                    for(let k = 1; k <= 9 && !this.matrixLockedFlag; k++){
                        
                        if(this.numValueIsPossible(this.numericalMatrix, k, j, i)){
                            
                            this.numericalMatrix[i][j] = k
                            this.animationMovesArray.push(`${i}${j}${k}`)

                            result = this.solveNumMatrix()
                            if(!this.matrixLockedFlag){
                                this.numericalMatrix[i][j] = 0
                                this.animationMovesArray.push(`${i}${j}0`)
                            }
                        }
                    
                    }
                    return result
                }
            }
        }
        
        if(print)
            this.printOutSolution()
        this.matrixLockedFlag = 1
        return 1
    }

    printOutSolution(){
        this.isAnimating = 1
        let currentAction = this.animationMovesArray.shift()
        
        if(currentAction == undefined)
            return
        const currentSlot = this.tagMatrix[currentAction[0]][currentAction[1]]

        let value = parseInt(currentAction[2])
        value > 0 ? currentSlot.greenBorder() : currentSlot.redBorder()
        currentSlot.fillSlot(value)
        if(this.animationMovesArray.length > 0){
            setTimeout(() => this.printOutSolution(), 0)
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
        let key = event.keyCode;

        if(key >= 37 && key <= 40)
            this.arrowPressed(key - 37)

        key = event.keyCode - 48
        
        if(!(key > 0 && key < 10))
            return
        if(this.selectedSlot.getValue() == 0 &&  this.tagValueIsPossible(this.selectedSlot, key)){
            this.selectedSlot.fillSlot(key)
            this.selectNext()
        }
    }

    arrowPressed(arrowKey){
        let coluna 
        let linha
        if(arrowKey == 0){
            coluna = this.selectedSlot.getX() > 0 ? this.selectedSlot.getX() - 1 : 8
            this.tagMatrix[this.selectedSlot.getY()][coluna].select()
        }
        if(arrowKey == 1){
            linha = this.selectedSlot.getY() > 0 ? this.selectedSlot.getY() - 1 : 8
            this.tagMatrix[linha][this.selectedSlot.getX()].select()
        }
        if(arrowKey == 2){
            coluna = this.selectedSlot.getX() < 8 ? this.selectedSlot.getX() + 1 : 0
            this.tagMatrix[this.selectedSlot.getY()][coluna].select()
        }
        if(arrowKey == 3){
            linha = this.selectedSlot.getY() < 8 ? this.selectedSlot.getY() + 1 : 0
            this.tagMatrix[linha][this.selectedSlot.getX()].select()
        }
        this.changeSelectedSlot()
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
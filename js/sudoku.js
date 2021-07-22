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



function removeElementAtIndex(array, index){
    return array.splice(index, 1)[0]
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




function randomNumber(number){
    return Math.floor(Math.random() * number)
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
        document.onkeydown = (e) => this.checkTowriteInSlot(e)
        document.querySelector('#clear').onclick = () => this.clearMatrix()
        this.animationMovesArray = []
        this.isAnimating = 0
        this.playingFlag = 0
        document.querySelector('#generate').onclick = () => this.play()
        this.solutionMatrix = this.createSlots(false)
        this.errorsTag = document.querySelector('#errors')
        this.numErrors = 0
        // document.querySelector('#generate').onclick = () => this.fillBoard(this.generatePuzzle())
        // this.animationActivated = false
        // document.querySelector('#animation-radio').onclick = (e) => this.animationActivated = e.target.checked
    }
    
    solve(){
        this.solveNumMatrix()
        this.playingFlag = 0
        if(!this.matrixLockedFlag){
            this.printOutSolution()
            // alert('UNSOLVABLE SUDOKU!')
        }
    }

    fillBoard(matrix){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                // console.log(this.tagMatrix)
                this.tagMatrix[i][j].writeInSlot(matrix[i][j])
            }
        }
    }

    fillSudoku(matrix, settingsObject = { checkNumSolutions: false, numSolutions: 0, maxSolutions: 1 }, rand = 0){
        
        
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
        
        if(settingsObject.checkNumSolutions == true && settingsObject.numSolutions < settingsObject.maxSolutions){
            settingsObject.numSolutions++;
            return 0;
        }
        return 1
    }

    play(){
        this.playingFlag = 1
        this.fillBoard(this.generatePuzzle(this.solutionMatrix))
        // this.fillBoard(this.generatePuzzle())   
        this.numErrors = 0
        this.errorsTag.classList.add('displayed')
        this.errorsTag.innerHTML = 'Errors = 0/3'
    }


    generatePuzzle(solutionMatrix = undefined){

        this.clearMatrix()

        const matrix = this.createSlots(false)

        this.fillSudoku(matrix,{ checkNumSolutions: false }, 1)

        if(solutionMatrix){
            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    solutionMatrix[i][j] = matrix[i][j]
                }
            }
        }


        const notTriedArray = []
        
        for(let i = 0; i < 81; i++){
            notTriedArray.push(i)
        }
        
        let randIndex = randomNumber(notTriedArray.length)
        let randSlot = notTriedArray[randIndex]
        let randX = randSlot % 9
        let randY = Math.floor(randSlot / 9)
        
        let curValue = 0
        
        const solutionsObject = { checkNumSolutions: true, numSolutions: 1, maxSolutions: 2 }

        
        while(notTriedArray.length > 30){

            solutionsObject.numSolutions = 0

            curValue = matrix[randY][randX]

            matrix[randY][randX] = 0

            let start = new Date()

            this.fillSudoku(matrixCopy(matrix), solutionsObject)
            
            let end = new Date()

            if(start - end > 500)
                break

            if(solutionsObject.numSolutions > 1){
                matrix[randY][randX] = curValue
                // attemptsMatrix[randY][randX] = 1
            }

            removeElementAtIndex(notTriedArray, randIndex)
            
            randIndex = randomNumber(notTriedArray.length)
            randSlot = notTriedArray[randIndex]
            randX = randSlot % 9
            randY = Math.floor(randSlot / 9)
        }
        return matrix
    }

    clearMatrix(){
        
        this.errorsTag.classList.remove('displayed')

        if(this.isAnimating)
            return

        this.matrixLockedFlag = 0
        const allSlots = this.tagMatrix.flat(Infinity)

        allSlots.forEach(element => {
            element.writeInSlot(0)
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

        if(this.playingFlag){
            if(value == this.solutionMatrix[slot.getY()][slot.getX()])
                return true
            else
                return false
        }


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
        
        let animationActivated = document.querySelector('#animation-radio').checked
        
        if(!animationActivated){
            this.justShowSolution()
            return
        }

        let currentAction = this.animationMovesArray.shift()
        
        
        this.isAnimating = 1

        if(currentAction == undefined)
            return

        const currentSlot = this.tagMatrix[currentAction[0]][currentAction[1]]

        let value = parseInt(currentAction[2])
        value > 0 ? currentSlot.greenBorder() : currentSlot.redBorder()
        currentSlot.writeInSlot(value)

        if(this.animationMovesArray.length > 0){
            setTimeout(() => this.printOutSolution(), 0)
        } else{
            this.isAnimating = 0
        }
    }


    justShowSolution(){
        this.tagMatrix.forEach(array => array.forEach(elemento => {
            elemento.updateValue(true)
        }))
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


    checkTowriteInSlot(event){

        if(this.selectedSlot == null || this.isAnimating)
            return

        let pencil = document.querySelector('#writing')

        let pencilMode = pencil.checked

        let key = event.keyCode;

        console.log(key)

        if(key == 81){
            pencil.checked = pencil.checked ? false : true
        }

        if(key >= 37 && key <= 40)
            this.arrowPressed(key - 37)

        key = event.keyCode - 48
        
        if(!(key > 0 && key < 10))
            return
        
        if(pencilMode){
            this.selectedSlot.writeInSlot(key, pencilMode)
            return
        }



        if(this.selectedSlot.getValue() == 0){
            if(this.tagValueIsPossible(this.selectedSlot, key)){
                this.selectedSlot.writeInSlot(key)
                this.selectNext()
            } else if(this.playingFlag){
                console.log(this.solutionMatrix)
                this.wrongValue()
            }
        }
    }

    wrongValue(){
        this.numErrors++
        if(this.numErrors > 3){
            this.gameOver()
            this.numErrors = 0
            return
        }
        document.querySelector('#errors').innerHTML = `Errors: ${this.numErrors}/3`
    }

    gameOver(){
        document.querySelector('#errors').innerHTML = `YOU LOST!`
        this.solve()
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
        this.x = xPosition
        this.y = yPosition
        this.value = 0
        this.putBorders()
        this.tag.onclick = () => this.select()
        this.pencilGrid = []
        this.pencilGridEmptyFlag = 1
        // this.intializePencilGrid()
    }

    intializePencilGrid(){

        this.pencilGridEmptyFlag = 0
        
        let pencilSlot
        this.tag.classList.add('slot-grid-mode')

        for(let i = 0; i < 9; i++){
            pencilSlot = document.createElement('div')
            pencilSlot.classList.add('pencil-slot')
            this.tag.appendChild(pencilSlot)
            this.pencilGrid.push(pencilSlot)
        }
    }

    removePencilGrid(){
        this.pencilGrid.forEach(elemento => {
            this.tag.removeChild(elemento)
        })
        this.tag.classList.remove('slot-grid-mode')
        
        this.pencilGrid = []

        this.pencilGridEmptyFlag = 1
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

    writeInSlot(newValue, pencilActivated = false){
        if(!pencilActivated){
            this.removePencilGrid()
            if(newValue == 0){
                this.tag.innerHTML = ''
                this.value = 0
                this.valuesMatrix[this.getY()][this.getX()] = 0
                // this.clearSlot()
            }
            else{
                this.tag.innerHTML = `${newValue}`
                this.value = newValue
                this.valuesMatrix[this.getY()][this.getX()] = newValue
            }
        } else {
            if(this.pencilGridEmptyFlag){
                this.intializePencilGrid()
                this.tag.classList.add('slot-grid-mode')
            }
            this.pencilGrid[newValue - 1].innerHTML = newValue
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

    updateValue(solution = false){

        if(this.getValue() == this.valuesMatrix[this.getY()][this.getX()])
            return

        this.writeInSlot(this.valuesMatrix[this.getY()][this.getX()])

        if(solution)
            this.greenBorder()
    }
}


const game = new SudokuGame()
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






class SudokuGame {


    constructor(){
        this.tag = document.querySelector('#sudoku-board')
        this.tagMatrix = this.createSlots()
        this.numericalMatrix = this.createSlots(false)
        this.selectedSlot = null;
        this.tag.onclick = () => this.changeSelectedSlot()
        document.onclick = (e) => this.checkOutsideClick(e)
        this.printCount = 0
        this.solveTagMatrix()
        this.matrixLockedFlag = 0
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
                    matrix[i].push(new SudokuSlot(this.tag, i, j))
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

    valueIsPossible(slot, value){
        const allObserved = [getMatrixColumn(this.tagMatrix, slot.getX()),
                            this.tagMatrix[slot.getY()],
                            getSquare(this.tagMatrix, slot)].flat(Infinity)
        
        for(let i = 0; i < allObserved.length; i++){
            if(allObserved[i].getValue() == value)
                return false
        }
        return true
    }

    solveTagMatrix(){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){

                if(this.tagMatrix[i][j].getValue() == 0){
                    const currentSlot = this.tagMatrix[i][j]
                    
                    for(let k = 1; k < 10 && !this.matrixLockedFlag; k++){
                        
                        if(this.valueIsPossible(currentSlot, k)){
                            this.printCount += 1
                            console.log(this.printCount)
                            console.log(k)
                            currentSlot.fillSlot(k)
                            this.solveTagMatrix()
                            if(!this.matrixLockedFlag)
                                currentSlot.fillSlot(0)
                        }
                    
                    }
                    return
                }
            }
        }
        this.matrixLockedFlag = 1
        return
    }


}



class SudokuSlot{
    constructor(tagBoard, yPosition, xPosition){
        this.boardTag = tagBoard
        this.tag = document.createElement('div')
        this.tag.classList.add('slot')
        this.boardTag.appendChild(this.tag)
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
        }
         else{
            this.tag.innerHTML = `${newValue}`
            this.value = newValue
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
}


const game = new SudokuGame()








class SudokuGame {
    constructor(){
        this.tag = document.querySelector('#sudoku-board')
        this.tagMatrix = this.createSlots()
        this.numericalMatrix = this.createSlots(false)
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









}



class SudokuSlot{
    constructor(tagBoard, yPosition, xPosition){
        this.tag = document.createElement('div')
        this.tag.classList.add('slot')
        tagBoard.appendChild(this.tag)
        this.x = xPosition
        this.y = yPosition
        this.value = 0
    }

    getX(){
        return this.x
    }

    getY(){
        return this.y
    }
}


const game = new SudokuGame()
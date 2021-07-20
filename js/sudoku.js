






class SudokuGame {
    constructor(){
        this.tag = document.querySelector('#sudoku-board')
        this.tagMatrix = this.createSlots()
        this.numericalMatrix = this.createSlots(false)
        this.selectedSlot = null;
        this.tag.onclick = () => this.changeSelectedSlot()
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
        if(this.selectedSlot != null){
            this.selectedSlot.unselect()
        }
        this.selectedSlot = this.findSelected()
        // console.log(this.selectedSlot)
    }

    
    findSelected(){
        let selectedSlot = null
        this.tagMatrix.forEach(array => array.forEach(elemento => {
            if(elemento.isSelected())
                selectedSlot = elemento
        }))
        return selectedSlot
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


    getX(){
        return this.x
    }

    getY(){
        return this.y
    }


    select(){
        this.tag.classList.add('selected-slot')
    }

    unselect(){
        this.tag.classList.remove('selected-slot')
    }

    isSelected(){
        return this.tag.classList.contains('selected-slot')
    }
}


const game = new SudokuGame()
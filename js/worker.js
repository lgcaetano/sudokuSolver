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





function createSlots(tagFlag = true){
    const matrix = []
    for(let i = 0; i < 9; i++){
        matrix.push([])
        for(let j = 0; j < 9; j++){
            if(tagFlag){}
                // matrix[i].push(new SudokuSlot(this.tag, i, j, this.numericalMatrix))
            else{
                matrix[i].push(0)
            }
        }
    }
    return matrix
}

function  numValueIsPossible(matrix, value, x, y){
    const allObserved = [getMatrixColumn(matrix, x), matrix[y], getSquareNumerical(matrix, x, y)].flat(Infinity)
     
     for(let i = 0; i < allObserved.length; i++){
        if(allObserved[i] == value)
            return false
    }
    return true
}



function fillSudoku(matrix, settingsObject = { checkNumSolutions: false, numSolutions: 0, maxSolutions: 1 }){
        
        
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    
    randomizeArray(numbers)
    
    let finishedFlag = 0
    
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
                    
            if(matrix[i][j] == 0){
                
                for(let k = 1; k <= 9 && !finishedFlag; k++){
                    
                    if(numValueIsPossible(matrix, numbers[k - 1], j, i)){
                        matrix[i][j] = numbers[k - 1]
                        finishedFlag = fillSudoku(matrix, settingsObject)
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




function generatePuzzle(solutionMatrix = undefined){

    // this.clearMatrix()

    const matrix = createSlots(false)

    fillSudoku(matrix,{ checkNumSolutions: false })

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
    
    const solutionsObject = { checkNumSolutions: true, numSolutions: 0, maxSolutions: 2 }

    let difficultyThreshold = 0
    
    while(notTriedArray.length > difficultyThreshold){

        solutionsObject.numSolutions = 0

        curValue = matrix[randY][randX]

        matrix[randY][randX] = 0

        let start = new Date()

        fillSudoku(matrixCopy(matrix), solutionsObject)
        
        let end = new Date()

        // console.log(notTriedArray.length, end - start, (end - start)*1 > 500)

        if((end - start) > 500)
            difficultyThreshold = 35

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




function solveNumMatrix(matrix, animationMovesArray){
        
    let result = 0
    

    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){

            if(matrix[i][j] == 0){
                
                for(let k = 1; k <= 9 && !result; k++){
                    
                    if(numValueIsPossible(matrix, k, j, i)){
                        
                        matrix[i][j] = k
                        animationMovesArray.push(`${i}${j}${k}`)

                        result = solveNumMatrix(matrix, animationMovesArray)
                        if(!result){
                            matrix[i][j] = 0
                            animationMovesArray.push(`${i}${j}0`)
                        }
                    }
                
                }
                return result
            }
        }
    }
    return 1
}


function getDimensions(array){
    if(array == undefined){
        return 0
    } else
        return 1 + getDimensions(array[0])
}

onmessage = (e) => {
    
    console.log('worker', e.data[1])
    
    let actionType = e.data[0]
    const matrix = e.data[1]
    // const movesArray = getDimensions(e.data[2]) == 1 ? e.data[2] : undefined
    // const solutionMatrix = getDimensions(e.data[2]) == 2 ? e.data[2] : undefined


    if(actionType == 'solve'){
        solveNumMatrix(matrix, e.data[2])
        console.log(e.data[2])
        postMessage(['solve', matrix, e.data[2]])
    }
    else if(actionType == 'generate'){
        postMessage(['generate', generatePuzzle(e.data[2]), e.data[2]])
    }
        // 

    

}
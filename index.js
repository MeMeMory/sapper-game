const gameBody = document.querySelector('.game-body')
const resultOfGame = document.querySelector('.result')

let isGameOver = false
let flags = 0

document.querySelector('.start').addEventListener('click', createBoard)

//create Board
function createBoard() {
	gameBody.className = 'game-body'
	flags = 0
	isGameOver = false
	resultOfGame.innerHTML = ``
	let bombAmount = document.querySelector('.bomb').value * 1

	const width = document.querySelector('.width').value * 1
	const isTopLeftSide = width + 1
	const isTopRightSide = width - 1
	const isTopSide = width
	const isleftSide = 0
	const isRightSide = width * width - 2
	const isBottomLeftSide = width * width - width
	const isBottomRightSide = width * width - (width + 2)
	const isBottomSide = width * width - (width + 1)

	//get shuffled game aaray with ramdom bombs
	const bombsArray = Array(bombAmount).fill('bomb')
	const emptyArray = Array(width * width - bombAmount).fill('valid')
	const gameArray = emptyArray.concat(bombsArray)
	const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
	squares = []
	gameBody.innerHTML = ''

	for (let i = 0; i < width * width; i++) {
		let square = document.createElement('div')
		square.setAttribute('id', i)
		square.classList.add(shuffledArray[i])
		gameBody.appendChild(square)
		squares.push(square)

		// //normal click
		square.addEventListener('click', function (e) {
			click(square)
		})

		// //cntrl and left click
		square.oncontextmenu = function (e) {
			e.preventDefault()
			addFlag(square, bombAmount)
		}
	}

	switch (width) {
		case 1:
			gameBody.classList.add('x1')
			break
		case 2:
			gameBody.classList.add('x2')
			break
		case 3:
			gameBody.classList.add('x3')
			break
		case 4:
			gameBody.classList.add('x4')
			break
		case 5:
			gameBody.classList.add('x5')
			break
		case 6:
			gameBody.classList.add('x6')
			break
		case 7:
			gameBody.classList.add('x7')
			break
		case 8:
			gameBody.classList.add('x8')
			break
		case 9:
			gameBody.classList.add('x9')
			break
		case 10:
			gameBody.classList.add('x10')
			break
		default:
			gameBody.classList.add('ERROR')
			squares = []
			gameBody.innerHTML = `
			<h1>Enter number from 0 to 99 in first input, and from 1 to 10 in second</h1>
			`
			break
	}

	//add numbers
	for (let i = 0; i < squares.length; i++) {
		let total = 0
		const isLeftEdge = i % width === 0
		const isRightEdge = i % width === width - 1

		if (squares[i].classList.contains('valid')) {
			if (
				i > isleftSide &&
				!isLeftEdge &&
				squares[i - 1].classList.contains('bomb')
			)
				total++
			if (
				i > isTopRightSide &&
				!isRightEdge &&
				squares[i + 1 - width].classList.contains('bomb')
			)
				total++
			if (i >= isTopSide && squares[i - width].classList.contains('bomb'))
				total++
			if (
				i >= isTopLeftSide &&
				!isLeftEdge &&
				squares[i - 1 - width].classList.contains('bomb')
			)
				total++
			if (
				i <= isRightSide &&
				!isRightEdge &&
				squares[i + 1].classList.contains('bomb')
			)
				total++
			if (
				i < isBottomLeftSide &&
				!isLeftEdge &&
				squares[i - 1 + width].classList.contains('bomb')
			)
				total++
			if (
				i <= isBottomRightSide &&
				!isRightEdge &&
				squares[i + 1 + width].classList.contains('bomb')
			)
				total++
			if (i <= isBottomSide && squares[i + width].classList.contains('bomb'))
				total++
			squares[i].setAttribute('data', total)
		}
	}
}

//add Flag with right click
function addFlag(square, bombAmount) {
	if (isGameOver) return

	const squereHasFlag = square.classList.contains('flag')
	if (squereHasFlag) {
		square.classList.remove('flag')
		square.innerHTML = ''
		flags--
	} else if (!square.classList.contains('checked') && flags < bombAmount) {
		square.classList.add('flag')
		square.innerHTML = '🚩'
		flags++
		checkForWin(bombAmount)
	}
}

//click on square actions
function click(square) {
	let currentId = square.id

	if (isGameOver) return
	if (square.classList.contains('checked') || square.classList.contains('flag'))
		return
	if (square.classList.contains('bomb')) {
		isGameOver = true
		gameOver(square)
	} else {
		let total = square.getAttribute('data')

		if (total != 0) {
			square.classList.add('checked')
			square.innerHTML = total
			return
		}

		checkSquare(square, currentId)
	}
	square.classList.add('checked')
}

//check neighbouring squeres once square is clicked
function checkSquare(square, currentId) {
	const width = document.querySelector('.width').value * 1
	const isLeftEdge = currentId % width === 0
	const isRightEdge = currentId % width === width - 1
	const isTopLeftSide = width + 1
	const isTopRightSide = width - 1
	const isTopSide = width
	const isLeftSide = 0
	const isRightSide = width * width - 2
	const isBottomLeftSide = width * width - width
	const isBottomRightSide = width * width - (width + 2)
	const isBottomSide = width * width - (width + 1)

	setTimeout(() => {
		if (currentId > isLeftSide && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId > isTopRightSide && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1 - width].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId >= isTopSide) {
			const newId = squares[parseInt(currentId) - width].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId >= isTopLeftSide && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1 - width].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId <= isRightSide && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId < isBottomLeftSide && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1 + width].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId <= isBottomRightSide && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1 + width].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
		if (currentId <= isBottomSide) {
			const newId = squares[parseInt(currentId) + width].id
			const newSquare = document.getElementById(newId)
			click(newSquare)
		}
	}, 25)
}

//game over
function gameOver() {
	if (isGameOver) {
		resultOfGame.innerHTML = `
		<h2>You Lose</h2>
	`
	}

	//show ALL the bombs
	squares.forEach(squre => {
		if (squre.classList.contains('bomb')) {
			squre.innerHTML =
				'<img src="https://img.icons8.com/emoji/48/000000/bomb-emoji.png"/>'
		}
	})
}

function checkForWin(bombAmount) {
	let matches = 0
	for (let i = 0; i < squares.length; i++) {
		if (
			squares[i].classList.contains('flag') &&
			squares[i].classList.contains('bomb')
		) {
			matches++
		}
		if (matches === bombAmount) {
			return (resultOfGame.innerHTML = `
				<h2>You Win!</h2>
			`)
		}
	}
}

function inputValidate() {
	const inputs = document.querySelectorAll('input')

	inputs.forEach(input => {
		input.addEventListener('input', () => {
			input.value = input.value.replace(/[^0-9]/g, '')

			let inputValue = input.value.trim()
			console.log(inputValue)

			if (input.classList.contains('bomb')) {
				input.value > 99 ? (input.value = 99) : input.value
			} else if (input.classList.contains('width')) {
				input.value > 10 ? (input.value = 10) : input.value
			}
		})
	})
}

inputValidate()

// function Sapper() {

// 	const uiElements = {
// 		boombsInput: null,
// 		widthInput: null,
// 		startButton: null,
// 		boardContainer: null
// 	};

// 	const gameSetting = {

// 	};

// 	function initUiElements() {
// 		uiElements.boardContainer = document.querySelector('.game-body');

// 	}

// 	function subscribeToEvents() {
// 		uiElements.startButton.addEventListener('click', createBoard);
// 	}

// 	function createBoard() {

// 	}

// 	function init() {
// 		initUiElements();
// 		subscribeToEvents();
// 	}

// 	init();
// }

// new Sapper();

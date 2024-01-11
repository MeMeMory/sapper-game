const createBoard = () => {
	const mines = Number(document.querySelector('.bomb').value)
	const size = Number(document.querySelector('.width').value)
	const gameBoard = document.querySelector('.board')
	const res = document.querySelector('.result > h2')
	let flags = 0

	if (mines > size * size) {
		isWinAction('Enter correct mine count')
		return
	}

	// Reset game field
	gameBoard.style.pointerEvents = 'all'
	gameBoard.style.gridTemplateColumns = `repeat(${size}, 3rem)`
	res.innerHTML = ''

	// https://img.icons8.com/emoji/48/000000/bomb-emoji.png

	let board = []

	const initializeBoard = () => {
		board = Array.from({ length: size }, () =>
			Array.from({ length: size }, () => ({
				value: 0,
				revealed: false,
				flag: false,
			}))
		)

		const mineSet = new Set()

		// Place mines
		for (let i = 0; i < mines; i++) {
			let x, y
			do {
				x = Math.floor(Math.random() * size)
				y = Math.floor(Math.random() * size)
			} while (mineSet.has(`${x},${y}`))

			mineSet.add(`${x},${y}`)
			board[x][y].value = 'bomb'
		}

		// Calculate numbers
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				if (board[x][y].value !== 'bomb') {
					board[x][y].value = countAdjacentMines(x, y)
				}
			}
		}
	}

	const countAdjacentMines = (x, y) => {
		let count = 0
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				const nx = x + dx
				const ny = y + dy
				if (isInsideBoard(nx, ny) && board[nx][ny].value === 'bomb') {
					count++
				}
			}
		}
		return count
	}

	const isInsideBoard = (x, y) => {
		return x >= 0 && x < size && y >= 0 && y < size
	}

	const revealCell = (x, y) => {
		if (board[x][y].revealed) return

		board[x][y].revealed = true
		gameBoard.querySelector(`#cell-${x}-${y}`).classList.add('open')

		if (board[x][y].value === 'bomb') {
			isWinAction('You Lose =(')
			revealAllMines()
		} else if (board[x][y].value === 0) {
			// Reveal adjacent cells
			for (let dx = -1; dx <= 1; dx++) {
				for (let dy = -1; dy <= 1; dy++) {
					const nx = x + dx
					const ny = y + dy
					if (isInsideBoard(nx, ny)) {
						revealCell(nx, ny)
					}
				}
			}
		}

		renderCell(x, y)
	}

	const renderCell = (x, y) => {
		const cellElement = document.getElementById(`cell-${x}-${y}`)
		cellElement.textContent = board[x][y].value === 0 ? '' : board[x][y].value
	}

	const renderBoard = () => {
		const boardElement = document.querySelector('.board')
		boardElement.innerHTML = ''

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const cell = document.createElement('div')

				cell.id = `cell-${x}-${y}`
				cell.classList.add('cell')

				if (board[x][y].revealed) {
					cell.textContent = board[x][y].value === 0 ? '' : board[x][y].value
				} else {
					// /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					// 	navigator.userAgent
					cell.addEventListener('click', () => revealCell(x, y))
					cell.oncontextmenu = e => {
						e.preventDefault()
						addFlag(x, y, cell)
					}
				}
				boardElement.appendChild(cell)
			}
		}
	}

	const addFlag = (x, y, cell) => {
		if (board[x][y].revealed) return

		if (flags < mines && board[x][y].flag !== true) {
			board[x][y].flag = true
			cell.innerHTML = '🚩'
			flags++
		} else if (board[x][y].flag === true) {
			board[x][y].flag = false
			cell.innerHTML = ''
			flags--
		}

		if (!!checkIsWin()) isWinAction('You Win!!!')
	}

	const revealAllMines = () => {
		board.map(row =>
			row.map(cell => {
				if (cell.value == 'bomb') cell.revealed = true
			})
		)
		renderBoard()
	}

	const checkIsWin = () => {
		return board
			.map(row => row.filter(cell => cell.value == 'bomb'))
			.reduce((acc, cur) => acc.concat(cur), [])
			.every(bomb => bomb.flag === true)
	}

	function isWinAction(text) {
		gameBoard.style.pointerEvents = 'none'
		res.innerHTML = text
	}

	// Initialize and render the board
	const startGame = () => {
		initializeBoard()
		renderBoard()
	}

	startGame()
}

const inputValidate = () => {
	const inputs = document.querySelectorAll('.game-settings input')
	const forBombs = inputs[0]
	const forWidth = inputs[1]

	validateHelper(forBombs, 99)
	validateHelper(forWidth, 10)
}

function validateHelper(input, maxValue) {
	input.addEventListener('input', () => {
		input.value = input.value.replace(/[^0-9]/g, '')

		input.value > maxValue ? (input.value = maxValue) : input.value
	})
}

inputValidate()

document.querySelector('.start').addEventListener('click', createBoard)

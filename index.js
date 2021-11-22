const gameBody = document.querySelector('.game-body');
let flags = 0;
let isGameOver = false;

document.querySelector('.start').addEventListener('click', createBoard);

//create Board
function createBoard() {
	const bombAmount = document.querySelector('.bomb').value * 1;
	const width = document.querySelector('.width').value * 1;

	//get shuffled game aaray with ramdom bombs
	const bombsArray = Array(bombAmount).fill('bomb');
	const emptyArray = Array(width * width - bombAmount).fill('valid');
	const gameArray = emptyArray.concat(bombsArray);
	const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
	squares = [];
	gameBody.innerHTML = '';

	for (let i = 0; i < width * width; i++) {
		let square = document.createElement('div');
		square.setAttribute('id', i);
		square.classList.add(shuffledArray[i]);
		gameBody.appendChild(square);
		squares.push(square);

		// //normal click
		square.addEventListener('click', function (e) {
			click(square);
		});

		// //cntrl and left click
		square.oncontextmenu = function (e) {
			e.preventDefault();
			addFlag(square);
		};
	}

	switch (width) {
		case 1:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x1');
			break;
		case 2:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x2');
			break;
		case 3:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x3');
			break;
		case 4:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x4');
			break;
		case 5:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x5');
			break;
		case 6:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x6');
			break;
		case 7:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x7');
			break;
		case 8:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x8');
			break;
		case 9:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x9');
			break;
		case 10:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x10');
			break;
		default:
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('EROR');
			squares = [];
			gameBody.innerHTML = `<h1>Введите значение в диапазоне от 1 до 10 </h1>`;
			break;
	}

	const isTopLeftSide = (width + 1);
	const isTopRightSide = (width - 1);
	const isTopSide = (width);
	const isleftSide = (0);
	const isRightSide = ((width * width) - 2);
	const isBottomLeftSide = ((width * width) - width);
	const isBottomRightSide = ((width * width) - (width + 2));
	const isBottomSide = ((width * width) - (width + 1));

	//add numbers
	for (let i = 0; i < squares.length; i++) {
		let total = 0;
		const isLeftEdge = (i % width === 0);
		const isRightEdge = (i % width === width - 1);

		if (squares[i].classList.contains('valid')) {
			if (i > isleftSide && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
			if (i > isTopRightSide && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
			if (i >= isTopSide && squares[i - width].classList.contains('bomb')) total++;
			if (i >= isTopLeftSide && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
			if (i <= isRightSide && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
			if (i < isBottomLeftSide && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
			if (i <= isBottomRightSide && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
			if (i <= isBottomSide && squares[i + width].classList.contains('bomb')) total++;
			squares[i].setAttribute('data', total);
		}
	}
}

//add Flag with right click
function addFlag(square) {
	if (isGameOver) return;
	if (!square.classList.contains('checked') && (flags < bombAmount)) {
		if (!square.classList.contains('flag')) {
			square.classList.add('flag');
			square.innerHTML = '🚩';
			flags++;
			checkForWin();
		} else {
			square.classList.remove('flag');
			square.innerHTML = '';
			flags--;
		}
	}
}

//click on square actions
function click(squere) {
	let currentID = squere.id;

	if (isGameOver) return;
	if (squere.classList.contains('checked') || squere.classList.contains('flag')) return;
	if (squere.classList.contains('bomb')) {
		gameOver(squere);
	} else {
		let total = squere.getAttribute('data');

		if (total != 0) {
			squere.classList.add('checked');
			squere.innerHTML = total;
			return;
		}

		checkSquare(squere, currentID);
	}
	squere.classList.add('checked');
}

//check neighbouring squres once square is clicked
function checkSquare(squere, currentId, width) {
	const isLeftEdge = (currentId % width === 0);
	const isRightEdge = (currentId % width === width - 1);
	setTimeout(() => {
		if (currentId > 0 && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId > 9 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1 - width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId > 10) {
			const newId = squares[parseInt(currentId) - width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId > 11 && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1 - width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 98 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 90 && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1 + width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 88 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1 + width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 89) {
			const newId = squares[parseInt(currentId) + width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
	}, 0);
}

//game over
function gameOver(squre) {
	console.log("BOOM!");
	// isGameOver = true;

	//show ALL the bombs
	squares.forEach(squre => {
		if (squre.classList.contains('bomb')) {
			squre.innerHTML = '<img src="https://img.icons8.com/emoji/48/000000/bomb-emoji.png"/>';
		}
	});
}

function checkForWin() {
	let matches = 0;
	for (let i = 0; i < squares.length; i++) {
		if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
			matches++;
		}
		if (matches === bombAmount) {
			console.log('YOU WIN!');
			// isGameOver = true;
			return;
		}
	}
}
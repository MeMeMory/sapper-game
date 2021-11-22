const gameBody = document.querySelector('.game-body');
let flags = 0;
let squares = [];
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

	bodySize(width);

	function bodySize() {
		if (width === 1) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x1');
		} else if (width === 2) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x2');
		} else if (width === 3) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x3');
		} else if (width === 4) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x4');
		} else if (width === 5) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x5');
		} else if (width === 6) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x6');
		} else if (width === 7) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x7');
		} else if (width === 8) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x8');
		} else if (width === 9) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x9');
		} else if (width === 10) {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('x10');
		} else {
			gameBody.classList.remove("x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "EROR");
			gameBody.classList.add('EROR');
			squares = [];
			gameBody.innerHTML = `<h1>Введите значение в диапазоне от 1 до 10 </h1>`;
		}
	}

	//add numbers
	for (let i = 0; i < squares.length; i++) {
		let total = 0;
		const isleftEdge = (i % width === 0);
		const isRigthEdge = (i % width === width - 1);

		if (squares[i].classList.contains('valid')) {
			if (i > 0 && !isleftEdge && squares[i - 1].classList.contains('bomb')) total++;
			if (i > 9 && !isRigthEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
			if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
			if (i > 11 && !isleftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
			if (i < 98 && !isRigthEdge && squares[i + 1].classList.contains('bomb')) total++;
			if (i < 90 && !isleftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
			if (i < 88 && !isRigthEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
			if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
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
			square.innerHTML = '<img src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/000000/external-flag-casino-kiranshastry-solid-kiranshastry.png"/>';
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
		gameOver(squere)
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

//check neighbouring squares once square is clicked
function checkSquare(square, currentId) {
	const isleftEdge = (currentId % width === 0);
	const isRightEdge = (currentId % width === width - 1);
	setTimeout(() => {
		if (currentId > 0 && !isleftEdge) {
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
		if (currentId > 11 && !isleftEdge) {
			const newId = squares[parseInt(currentId) - 1 - width].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 98 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1].id;
			const newSquare = document.getElementById(newId);
			click(newSquare);
		}
		if (currentId < 90 && !isleftEdge) {
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
			isGameOver = true;
			return;
		}
	}
}
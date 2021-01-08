import {Card} from "./Card";
import {GameState} from "./GameState";

/**
 * Represents the abstract functionality for a game of PyramidSolitaire, regardless of the number of
 * pyramids of the game.
 */
 export abstract class AbstractPyramidSolitaire {
    protected pyramid: Array<Array<Card>>;
    private stock: Array<Card>;
    protected draws: Array<Card>;
    protected gamestate: GameState;
    protected removalValue: number = 13;

    /**
     * Constructs a {@code AbstractPyramidModel} object.
     */
    constructor() {
        this.gamestate = GameState.NOT_STARTED;
    }

    /**
     * Return a valid and complete deck of cards for a game of Pyramid Solitaire. There is no
     * restriction imposed on the ordering of these cards in the deck. The validity of the deck is
     * determined by the rules of the specific game in the classes implementing this interface.
     *
     * @return the deck of cards as a list
     */
    abstract getDeck(): Array<Card>;

    /**
     * <p>Deal a new game of Pyramid Solitaire.
     * The cards to be used and their order are specified by the the given deck, unless the {@code
     * shuffle} parameter indicates the order should be ignored.</p>
     *
     * <p>This method first verifies that the deck is valid. It deals cards in rows
     * (left-to-right, top-to-bottom) into the characteristic pyramid shape with the specified number
     * of rows, followed by the specified number of draw cards. When {@code shuffle} is {@code false},
     * the 0th card in {@code deck} is used as the first card dealt.</p>
     *
     * <p>This method should have no other side effects, and should work for any valid arguments.</p>
     *
     * @param deck    the deck to be dealt
     * @param shuffle if {@code false}, use the order as given by {@code deck}, otherwise use a
     *                randomly shuffled order
     * @param numRows number of rows in the pyramid
     * @param numDraw number of draw cards available at a time
     * @throws Error if the deck is null or invalid, the number of pyramid rows or
     *                                  number of available draw cards is non-positive, or a full
     *                                  pyramid and draw pile cannot be dealt with the number of given
     *                                  cards in deck
     */
    startGame(deck: Array<Card>, shuffle: boolean, numRows: number, numDraw: number): void {

        //Checks that the given deck is not null or invalid.
        if (deck == null || !this.isValidDeck(deck)) {
            throw new Error("The deck cannot be null.");
        }

        // Checks if a pyramid of the given size and draw pile of the given size
        // are possible with the size of the given deck.
        if (!this.isEnoughCards(deck.length, numRows, numDraw)) {
            throw new Error("Not enough cards in this deck for this deal.");
        }

        // Checks if the number of rows or draws is 0, errors if so.
        if (numRows == 0 && numDraw == 0) {
            throw new Error("Rows and draws cannot be zero.");
        }

        //Checks that the given number of rows is non-negative.
        if (numRows <= 0) {
            throw new Error("Number of rows cannot be negative or zero.");
        }

        //Checks that the given number of draw cards is non-negative.
        if (numDraw < 0) {
            throw new Error("Number of draw cards cannot be negative.");
        }
        // Copies the deck over to a temp so that it will not be altered.
        let deckCopy: Array<Card> = new Array<Card>();

        deck.forEach(function (value) {
            deckCopy.push(value);
        });

        this.pyramid = this.dealCards(numRows, deckCopy, shuffle);
        this.draws = new Array<Card>();
        for (let drawIndex = 0; drawIndex < numDraw; drawIndex++) {
            this.draws.push(deckCopy[0]);
            deckCopy.shift();
        }
        this.stock = deckCopy;
        this.gamestate = GameState.STARTED;
    }

    /**
     * Creates a list of lists of cards to represent the pyramid for the {@code BasicPyramidSolitaire}
     * class.
     *
     * @param numRows the height of the pyramid to be created
     * @param deck    the cards to be used for creating the pyramid
     * @param shuffle indicates whether or not the user want's the deck to be shuffled
     * @return a list of list of cards representing a pyramid for this game
     */
    protected abstract dealCards(numRows: number, deck: Array<Card>, shuffle: boolean): Array<Array<Card>>;



    /**
     * Execute a two-card move on the pyramid, using the two specified card positions.
     *
     * @param row1  row of first card position, numbered from 0 from the top of the pyramid
     * @param card1 card of first card position, numbered from 0 from left
     * @param row2  row of second card position
     * @param card2 card of second card position
     * @throws Error if the move is invalid
     * @throws Error if the game has not yet been started
     */
    removeTwo(row1: number, card1: number, row2: number, card2: number) : void {
        this.removeTwoChecks(row1, card1, row2, card2);

        // Checks if the given cards are exposed.
        if (this.isCovered(row1, card1) || this.isCovered(row2, card2)) {
            throw new Error("The card at the given index is covered and therefore "
                + "cannot be removed.");
        }
        // Replaces the given cards with null
        this.pyramid[row1][card1] = null;
        this.pyramid[row2][card2] = null;
    }


    /**
     * Execute a single-card move on the pyramid, using the specified card position.
     *
     * @param row  row of the desired card position, numbered from 0 from the top of the pyramid
     * @param card card of the desired card position, numbered from 0 from left
     * @throws Error if the move is invalid
     * @throws Error if the game has not yet been started
     */
    remove(row: number, card: number): void {
        // Checks if this game has been started.
        this.checkStarted();

        // Checks if the given row is in bounds from this game's pyramid.
        if (!this.isRowInBounds(row)) {
            throw new Error("The given row index is out of bounds.");
        }
        // Checks if the given card is in bounds from this game's pyramid.
        if (!this.isCardInBounds(row, card)) {
            throw new Error(
                "The given card index is out of bounds for the given row.");
        }
        // Checks if the given card is null.
        if (this.getCardAt(row, card) == null) {
            throw new Error("No card at the given index. ");
        }
        // Checks if the given card has a value of the removal value.
        if (this.getCardAt(row, card).getValue() != this.removalValue) {
            throw new Error("The given card does not have a value of 13, "
                + "and therefore cannot be removed.");
        }
        // Checks if the given card is covered.
        if (this.isCovered(row, card)) {
            throw new Error("The card at the given index is covered and therefore "
                + "cannot be removed.");
        }

        // Sets the card at the given index to null.
        this.pyramid[row][card] = null;
    }

    /**
     * Execute a two-card move, using the specified card from the draw pile and the specified card
     * from the pyramid.
     *
     * @param row  row of the desired card position, numbered from 0 from the top of the pyramid
     * @param card card of the desired card position, numbered from 0 from left
     * @throws Error if the move is invalid
     * @throws Error if the game has not yet been started
     */
    removeUsingDraw(drawIndex: number, row: number, card: number): void {
        // Checks if this game has been started.
        this.checkStarted();

        // Checks if the given row is in bounds for this game's pyramid.
        if (!this.isRowInBounds(row)) {
            throw new Error("The given row index is out of bounds.");
        }
        // Checks if the given card is in bounds for this game's pyramid.
        if (!this.isCardInBounds(row, card)) {
            throw new Error(
                "The given card index is out of bounds for the given row.");
        }
        // Checks if the given draw index is in bounds for the number of draw cards.
        if (drawIndex >= this.draws.length || drawIndex < 0) {
            throw new Error("The given draw index is out of bounds.");
        }
        // Checks if the given card is null.
        if (this.getCardAt(row, card) == null) {
            throw new Error("No card at the given index: "+ row+ ", " + card+".");
        }
        if (this.draws[drawIndex] == null) {
            throw new Error("No card at the given index: "+ drawIndex +".");
        }
        // Checks if the given draw card and pyramid card add up to the removal value.
        if (this.getCardAt(row, card).getValue() + this.draws[drawIndex].getValue()
            != this.removalValue) {
            throw new Error("The given cards do not sum to a value of 13, "
                + "and therefore cannot be removed.");
        }
        // Checks if the given pyramid card is covered.
        if (this.isCovered(row, card)) {
            throw new Error("The card at the given index is covered and therefore "
                + "cannot be removed.");
        }

        // Sets pyramid card to null and discards the given draw card.
        this.pyramid[row][card] = null;
        this.discardDraw(drawIndex);
    }

    /**
     * Discards an individual card from the draw pile.
     *
     * @param drawIndex the card to be discarded
     * @throws Error if the index is invalid or no card is present there.
     * @throws Error if the game has not yet been started
     */
    discardDraw(drawIndex: number): void {
        // Checks if this game has been started.
        this.checkStarted();

        // Checks if the given drawIndex is in bounds for the length of draws.
        if (drawIndex < 0 || drawIndex >= this.draws.length) {
            throw new Error("Index does not exist in the draw pile.");
        }
        // Checks if there is a card at the given index.
        if (this.draws[drawIndex] == null) { //should deal with 0 index 0 length
            throw new Error("There is no card at this index.");
        }
        // removes the given card
        //delete this.draws[drawIndex];
        // replaces the card absent in draws if there is one available
        if (this.stock.length > 0) {
            this.draws[drawIndex] = (this.stock[0])
            this.stock.shift();
        } else {
            this.draws[drawIndex] = null;
              //  this.draws.push(null);
        }

    }

    /**
     * Returns the number of rows originally in the pyramid, or -1 if the game hasn't been started.
     *
     * @return the height of the pyramid, or -1
     */
    getNumRows(): number {
        // Checks if this game has started.
        if (this.gamestate == GameState.NOT_STARTED) {
            return -1;
        }
        // returns the height of this game's pyramid
        return this.pyramid.length;
    }

    /**
     * Returns the maximum number of visible cards in the draw pile, or -1 if the game hasn't been
     * started.
     *
     * @return the number of visible cards in the draw pile, or -1
     */
    getNumDraw(): number {
        // Checks if this game has started.
        if (this.gamestate == GameState.NOT_STARTED) {
            return -1;
        }
        // returns the length of this game's draws list
        return this.draws.length;
    }

    /**
     * Returns the width of the requested row, measured from the leftmost card to the rightmost card
     * (inclusive) as the game is initially dealt.
     *
     * @param row the desired row (0-indexed)
     * @return the number of spaces needed to deal out that row
     * @throws Error if the row is invalid
     * @throws Error if the game has not yet been started
     */
    getRowWidth(row: number): number {
        // Checks if this game has been started.
        this.checkStarted();

        // Checks if the row is in bounds for this game's pyramid.
        if (!this.isRowInBounds(row)) {
            throw new Error("The given row is out of bounds.");
        }
        // returns the length of the given row
        return this.pyramid[row].length;
    }

    /**
     * Signal if the game is over or not.
     *
     * @return true if game is over, false otherwise
     * @throws IllegalStateException if the game hasn't been started yet
     */
    isGameOver(): boolean {
        // Checks if this game has been started.
        this.checkStarted();

        // Checks if the game has been won.
        if (this.isGameWon()) {
            return true;
        }

        // checks if draws is empty
        this.draws.forEach(function (value) {
            if (value != null) {
                return false;
            }
        });

        let uncovered: Array<Card> = this.getUncovered();

        // iterates over all the uncovered cards and checks
        // if any of them evaluate to the removal value.
        if (this.canBeRemoved(uncovered)) {
            return false;
        }

        // iterates over all the uncovered cards and checks if any pair may add up to the removal value.
        if (this.canAddToRemovalValue(uncovered)) {
            return false;
        }

        //checks if there are cards in stock, and if we have draw space to access them.
        return !(this.getNumDraw() > 0 && this.stock.length > 0);
    }

    /**
     * Return the current score, which is the sum of the values of the cards remaining in the
     * pyramid.
     *
     * @return the score
     * @throws IllegalStateException if the game hasn't been started yet
     */
    getScore(): number {
        // Checks if this game has started.
        this.checkStarted();

        if (this.isGameWon()) {
            return 0;
        }

        // iterates through the results and adds up the values
        let result: number = 0;
        this.pyramid.forEach(function (row) {
            row.forEach(function(card){
                if(card != null) {
                    result = result + card.getValue();
                }
            })
        });
        return result;
    }

    /**
     * Returns the card at the specified coordinates.
     *
     * @param row  row of the desired card (0-indexed from the top)
     * @param card column of the desired card (0-indexed from the left)
     * @return the card at the given position, or <code>null</code> if no card is there
     * @throws Error if the coordinates are invalid
     * @throws Error if the game hasn't been started yet
     */
    getCardAt(row: number, card: number): Card {
        // Checks if this game has started.
        this.checkStarted();

        // Checks if the given row is in bounds for this game's pyramid.
        if (!this.isRowInBounds(row)) {
            throw new Error("The given row index is out of bounds.");
        }
        // Checks if the given card is in bounds for this game's pyramid.
        if (!this.isCardInBounds(row, card)) {
            throw new Error("The given card index is out of bounds.");
        }

        // returns the card at the given index
        return this.pyramid[row][card];
    }

    /**
     * Returns the currently available draw cards. There should be at most {@link
        * PyramidSolitaireModel#getNumDraw} cards (the number specified when the game started) -- there
     * may be fewer, if cards have been removed.
     *
     * @return the ordered list of available draw cards
     * @throws Error if the game hasn't been started yet
     */
    getDrawCards(): Array<Card> {
        // Checks if the game has started.
        this.checkStarted();

        // Makes a copy of the draw cards list and returns it
        let drawsCopy: Array<Card> = new Array<Card>();
        this.draws.forEach(function(card){
            drawsCopy.push(card);
        });
        return drawsCopy;
    }

    /**
     * Checks whether the card at the given row and card index is covered, meaning that it has
     * non-null card values in the two spaces directly below the card itself.
     *
     * @param row  the row index of the card we are checking
     * @param card the card index of the card we are checking
     * @return whether the card at the given index is covered
     */
    protected isCovered(row: number, card: number): boolean {
        // Checks if the given row index is in bounds for this game's pyramid.
        if (row >= this.pyramid.length || row < 0) {
            throw new Error("The given row index is out of bounds.");
        }
        // Checks if the given card index is in bounds for this game's pyramid.
        if (card >= this.pyramid[row].length || card < 0) {
            throw new Error("The given card index is out of bounds"
                + " for the given row.");
        }
        // Checks if the card at the given index is in the bottom row.
        if (row == this.pyramid.length - 1) {
            return false;
        } else {
            // Checks if the cards directly below the card at the given index are null.
            return this.getCardAt(row + 1, card) != null ||
                this.getCardAt(row + 1, card + 1) != null;
        }
    }

    /**
     * Checks whether the given deck is valid for this game of pyramid solitaire. Meaning that the
     * given deck has no repeated cards, has no null cards, and is the same size as the valid deck
     * produced by this class.
     *
     * @param deck the List of cards that we are checking for validity
     * @return whether the given list is a valid deck for this game
     */
    protected abstract isValidDeck(deck: Array<Card>): boolean;

    /**
     * Returns whether this game is won, meaning there are no cards left in the pyramid, or rather
     * that all cards in the pyramid are null.
     *
     * @return whether all of the cards in this game's pyramid are null.
     */
    protected isGameWon(): boolean {
        // iterates over the cards in this game's pyramid and checks if any are not null
        this.pyramid.forEach(function (row) {
            row.forEach(function (card){
                if (card != null) {
                    return false;
                }
            })
        })
        return true;
    }

    /**
     * Returns whether a deck of the given size could be used to deal a pyramid of the given number of
     * rows, with the given number of draws.
     *
     * @param deckSize the size of the deck in question
     * @param numRows  the number of rows in the pyramid in question
     * @param numDraws the number of draws in the game in question
     * @return if a deck of the given size has enough cards to deal
     */
    protected abstract isEnoughCards(deckSize: number, numRows: number, numDraws: number): boolean;

    /**
     * Returns whether the given row index is in bounds for this game's pyramid. Meaning, a row of the
     * given index exists in the pyramid.
     *
     * @param row the row index
     * @return whether the row is in bounds for this game's pyramid
     */
    protected isRowInBounds(row: number): boolean {
        return row < this.pyramid.length && row >= 0;
    }

    /**
     * Returns whether the given card index is in bounds for the given row for this game's pyramid.
     * Meaning, a row of the given index exists, and a card of the given index in the given row
     * exists.
     *
     * @param row  the row index
     * @param card the card index
     * @return whether the card is within the bounds of this game's pyramid
     */
    protected isCardInBounds(row: number, card: number): boolean {
        return this.isRowInBounds(row) && card < this.pyramid[row].length && card >= 0;
    }

    /**
     * Returns whether any of the cards in the given list can be removed by themselves, assuming all
     * the given cards are uncovered (can be removed) and that in order to be removed the card value
     * must match the removal value.
     *
     * @param cards the list of cards being checked
     * @return whether the given list of cards contains cards which can be removed
     */
    private canBeRemoved(cards: Array<Card>): boolean {
        // iterates over all of the cards in the given list and
        // checks if they have a value equal to the removal value

        for (let index = 0; index < cards.length ; index++) {
            if (cards[index].getValue() == this.removalValue) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns whether any two cards in the given list of cards can sum to the removal value of this
     * game.
     *
     * @param cards list of cards to be checked
     * @return whether there exists in the list a pair of cars that sum to the removal value
     */
    private canAddToRemovalValue(cards: Array<Card>): boolean {
        // iterates over every possible pairing of cards in the given list of cards
        for (let card1 = 0; card1 < cards.length; card1 += 1) {
            for (let card2 = 0; card2 < cards.length; card2 += 1) {
                if (card1 != card2 &&
                    cards[card1].getValue() + cards[card2].getValue() == this.removalValue) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns a list of the uncovered cards in this game's pyramid, meaning all of the cards that do
     * not have two cards directly below them in the pyramid.
     *
     * @return list of all uncovered cards in this game's pyramid
     */
    private getUncovered(): Array<Card> {
        let uncovered: Array<Card> = new Array<Card>();
        // iterates over all of the cards in the pyramid and adds the uncovered ones
        for (let row = 0; row < this.pyramid.length; row += 1) {
            for (let card = 0; card < this.pyramid[row].length; card += 1) {
                if (this.getCardAt(row, card) != null && !this.isCovered(row, card)) {
                    uncovered.push(this.getCardAt(row, card));
                }
            }
        }
        return uncovered;
    }

    /**
     * Checks if this game has been started, if not, throws an IllegalStateException.
     *
     * @throws IllegalStateException when game has not been started
     */
    protected checkStarted(): void {
        if (this.gamestate == GameState.NOT_STARTED) {
            throw new Error("The game has not yet started.");
        }
    }

    /**
     * Checks if the draw pile of this game has only null cards, meaning all draw cards have been
     * discarded.
     *
     * @return whether all cards in this game's draws are discarded (null)
     */
    protected allDiscarded(): boolean {
        this.draws.forEach(function (card) {
            if (card != null) {
                return false;
            }
        })
        return true;
    }

    /**
     * Checks if the removal of the cards with the given indexes is possible, errors if not.
     */
    protected removeTwoChecks(row1: number, card1: number, row2: number, card2: number): void{
        // Checks if this game has been started.
        this.checkStarted();
        // Checks if the given rows are within the bounds of this game's pyramid.
        if (!this.isRowInBounds(row1) || !this.isRowInBounds(row2)) {
            throw new Error("The given row is out of bounds.");
        }
        // Checks if the given cards are within the bounds of the game's pyramid.
        if (!this.isCardInBounds(row1, card1) || !this.isCardInBounds(row2, card2)) {
            throw new Error("The given card is out of bounds for the given row.");
        }
        // Checks if either of the given cards is null.
        if (this.getCardAt(row1, card1) == null) {
            throw new Error("No card at the given index, " + row1 + ", " + card1 + ".");
        }

        if (this.getCardAt(row2, card2) == null) {
            throw new Error("No card at the given index, " + row2 + ", " + card2 + ".");
        }


        // Checks if the cards at the given indexes add up to the removal value.
        if (this.getCardAt(row1, card1).getValue() + this.getCardAt(row2, card2).getValue()
            != this.removalValue) {
            throw new Error("The given cards do not add up to 13, and "
                + "therefore cannot be removed.");
        }
    }
















}
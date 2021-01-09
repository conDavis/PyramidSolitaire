import {Pos2D} from "./Pos2D";
import {ViewCard} from "./ViewCard";
import {Card} from "./Card";
import {BasicPyramidSolitaire} from "./BasicPyramidSolitaire";
import {PyramidSolitaireVisualView} from "./PyramidSolitaireVisualView";

/**
 * Represents the controller for the visual version of pyramid solitaire.
 * Communicates between the view and the model to allow for the interactive playing of the game.
 */
export class PyramidSolitaireVisualController {
    private view: PyramidSolitaireVisualView;
    private model: BasicPyramidSolitaire;
    readonly CARD_WIDTH = 60;
    readonly CARD_HEIGHT = 70;

    /**
     * Constructs a PyramidSolitaireVisualController object with the given view and model.
     * @param view the view
     * @param model the model
     */
    constructor(view: PyramidSolitaireVisualView, model: BasicPyramidSolitaire) {
        this.view = view;
        this.model = model;
    }

    /**
     * Runs a visual game of pyramid solitaire with the given deck and pyramid attributes.
     * @param deck the deck to be used in the game
     * @param shuffle whether or not the deck should be shuffled prior to plau
     * @param numRows the number of rows in the given pyramid
     * @param numDraw the number of draw cards to be used
     */
    playGame(deck: Array<Card>, shuffle: boolean, numRows: number, numDraw: number): void {
        // starts the game in the model and starts the interaction in the view
        this.model.startGame(deck, shuffle, numRows, numDraw);
        console.log(this.model.getPyramid().length);

        this.view.beginInteraction(this);

        // creates viewCards for every card in the model
        const pyramid: Array<Array<Card>>  = this.model.getPyramid(); // is const okay
        console.log(pyramid);
        for (let row = 0; row < pyramid.length; row++) {
            for (let col = 0; col < pyramid[row].length; col++) {
               // console.log(row +" "+ col);
               this.view.drawCard(
                   this.createPyramidViewCard(pyramid[row][col].toString(), row, col, pyramid.length));

            }
        }

        const drawCards: Array<Card> = this.model.getDrawCards();

        // creates viewCards for every drawCard in the model
        for (let index = 0; index < drawCards.length; index++) {
           this.view.drawCard(this.createDrawViewCard(drawCards[index].toString(), index));
        }
        // updates the score and refreshes the view.
        this.view.updateScore(this.model.getScore());
        this.view.refresh();


    }

    /**
     * Removes the cards in the pyramid with the given positions if possible.
     * @param cardPositions the positions of the cards being attempted to be removed
     */
    removeSelected(cardPositions: Array<Pos2D>): void {
        if (this.validCards(cardPositions)) {

            if (cardPositions.length == 1 && this.containsDrawCard(cardPositions)) {
                this.discardDraw(cardPositions);
            } else {

                try {
                    if (this.containsDrawCard(cardPositions)) {
                        this.removeWithDraw(cardPositions);
                    } else {
                        this.removeWithoutDraw(cardPositions);
                    }

                    // makes the cards removed from the pyramid invisible
                    for (let index = 0 ; index < cardPositions.length ; index++) {
                        this.view.makeInvisible(cardPositions[index]);
                    }
                } catch (e) {
                    // deselects the cards if they cannot be removed
                    this.view.deselect(cardPositions);

                }
            }
        } else {
            // deselects the cards if they are an invalid pairing (2 draw cards)
            this.view.deselect(cardPositions);
        }
        // updates the score and refreshes the view
        this.view.updateScore(this.model.getScore());
        this.view.refresh();
    }

    /**
     * Creates and returns a view card representing a card in the pyramid of the game at the given row
     * col index with the given label within a pyramid of the given height.
     *
     * @param label         the label of the card to be created
     * @param row           the row of the card the returned view card is representing
     * @param col           the column of the card the returned view card is representing
     * @param pyramidHeight the height of the pyramid in which the view card is being created (in rows)
     * @return a view card representing a card with the given attributes within a pyramid of the given height.
     */
    private createPyramidViewCard(label: String, row: number, col: number, pyramidHeight: number): ViewCard {
        return new ViewCard(new Pos2D((this.CARD_WIDTH + 5) * (col) + this.xOffset(row, pyramidHeight),
            (this.CARD_HEIGHT - 10) * (row ) + 20), new Pos2D(row, col), <string>label, false);
    }

    /**
     * Creates and returns a view card to represent a card in the draw pile with the given label and
     * index.
     *
     * @param label the label of the card to be created
     * @param index the index of the card to be created
     * @return the view card with the given attributes to represent a draw card.
     */
    private createDrawViewCard(label: String, index: number): ViewCard {
        return new ViewCard(new Pos2D(index * (this.CARD_WIDTH + 5) + 20,
            525), new Pos2D(index, -1), <string>label, true);
    }

    /**
     * Returns the offset in the x plane to be used when positioning cards in the pyramid for the screen position.
     *
     * @param row           the row of the card being positioned
     * @param pyramidHeight the height of the pyramid in rows
     * @return the xOffset to be using in positioning a card in the given row in a pyramid of the given height.
     */
    private xOffset(row: number, pyramidHeight: number): number {
        return (pyramidHeight - row - 1) * (this.CARD_WIDTH + 5) / 2 + 115;
    }

    /**
     * Checks if the given list of pyramid positions contains a position of a draw card.
     *
     * @param positions the positions to be checked
     * @return whether the given positions contain the position of a draw card
     */
    private containsDrawCard(positions: Array<Pos2D>): boolean {
        for (let index = 0; index < positions.length; index++) {
            if (positions[index].getY() == -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the given positions represent a valid pairing of cards, meaning the cards
     * do not contain more than one draw card, which would be an illegal move.
     *
     * @param positions the positions in the pyramid of the cards being checked.
     * @return whether the cards with the given positions are a valid pairing and can be removed together.
     */
    private validCards(positions: Array<Pos2D>): boolean {
        let drawCardsCount: number = 0;
        for (let index = 0; index < positions.length; index++) {
            if (positions[index].getY() == -1) {
                drawCardsCount++;
            }
        }
        return drawCardsCount <= 1;
    }

    /**
     * Discards a drawCard in the model and updates the view.
     *
     * @param cardPositions the given positions of the drawCard.
     */
    private discardDraw(cardPositions: Array<Pos2D>): void {
        try {
            this.model.discardDraw(cardPositions[0].getX());
        } catch (e) {
            this.view.deselect(cardPositions);
        }
        this.view.updateDraws(cardPositions[0], this.model.getDrawCards());
    }

    /**
     * Discards the given cards including a drawCard and updates the view.
     *
     * @param cardPositions the given positions of the cards to be discarded.
     */
    private removeWithDraw(cardPositions: Array<Pos2D>): void {
        let drawCard: Pos2D = null;
        let nonDrawCard: Pos2D = null;
        // finds he position representing the draw and non-draw cards
        for (let index = 0; index < cardPositions.length; index++) {
            if (cardPositions[index].getY() === -1) {
                drawCard = cardPositions[index];
            } else {
                nonDrawCard = cardPositions[index];
            }
        }

            this.model.removeUsingDraw(drawCard.getX(), nonDrawCard.getX(), nonDrawCard.getY());
            this.view.updateDraws(drawCard, this.model.getDrawCards());

    }

    /**
     * Discards the given cards not including a drawCard and updates the view.
     *
     * @param cardPositions the given positions of the cards to be discarded.
     */
    private removeWithoutDraw(cardPositions: Array<Pos2D>): void {
        if (cardPositions.length == 1) { // if we are removing one card
            this.model.remove(cardPositions[0].getX(), cardPositions[0].getY());
        } else { // if we are removing two cards
            this.model.removeTwo(cardPositions[0].getX(), cardPositions[0].getY(),
                cardPositions[1].getX(), cardPositions[1].getY());

        }
    }




}
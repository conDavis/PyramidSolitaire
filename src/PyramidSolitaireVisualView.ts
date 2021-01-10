import {ViewCard} from "./ViewCard";
import {PyramidSolitaireVisualController} from "./PyramidSolitaireVisualController";
import {Card} from "./Card";
import {Pos2D} from "./Pos2D";



/**
 * Represents the visual view for a game of Pyramid Solitaire
 */
export class PyramidSolitaireVisualView {
    private controller: PyramidSolitaireVisualController;
    private canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    selected: number;
    drawsSelected: number;
    private score: number;
    private readonly cards: Array<ViewCard>;
     manager = this;

    /**
     * Creates a PyramidSolitaireVisualView object with the given canvasRenderingContext for rendering.
     */
    constructor(canvas: HTMLElement, removeButton: HTMLElement, rulesButton: HTMLElement) {
        this.selected = 0;
        this.drawsSelected = 0;
        this.score = 0;
        this.canvas = <HTMLCanvasElement> canvas;
        this.cards = new Array<ViewCard>();
        const canvas2: HTMLCanvasElement = <HTMLCanvasElement> canvas;
        const ctx = canvas2.getContext("2d");
        this.context = ctx;
        // adding click action listener
        canvas.addEventListener('click', this.mouseListener.bind(this), false);
        // adds button action listeners
        removeButton.addEventListener('click', this.removeButtonActionListener.bind(this), false);
        rulesButton.addEventListener('click', this.rulesButtonActionListener, false);

    }

    /**
     * Starts the ability of the view and the controller to communicate allowing the interactive
     * features of the game of pyramid solitaire.
     * @param controller the controller this view will interact with
     */
    beginInteraction(controller: PyramidSolitaireVisualController): void {
        this.controller = controller;
    }

    /**
     * Repaints the visual view.
     */
    refresh(): void {
        // sets the background
        this.context.font = "25px Veranda"
        this.context.fillStyle = "#0b8327";
        this.context.fillRect(0, 0, 700, 800); // make the width and height constants

        // draws the score and draws labels
        this.context.fillStyle = "#ffffff";
        this.context.fillText("Draws:", 25, 500);


        // win screen if the score of 0 is met
        if (this.score == 0) {
            this.context.font = "35px Veranda"
            this.context.fillText("You Won! ", 500, 175);
        } else { // if the game is not won
            this.context.font = "25px Veranda"
            this.context.fillText("Score: " + this.score, 500, 175);
        }
        // renders each of the viewCards
        for (let index = 0 ; index < this.cards.length; index++) {
            this.cards[index].render(this.context);
        }
    }

    /**
     * Draws the given viewShape in the visual view.
     *
     * @param viewCard the viewShape to be drawn.
     */
    drawCard(card: ViewCard): void {
        this.cards.push(card);
    }

    /**
     * Makes the card with the given position in the pyramid invisible, if possible.
     * @param pyramidPos the position of the card to be made invisible
     */
    makeInvisible(pyramidPos: Pos2D): void {
        // iterates over all the viewCards and makes the cards with the given pyramid positions invisible
        for (let index = 0 ; index < this.cards.length ; index ++) {
            if (this.cards[index].getPyramidPosition().equals(pyramidPos)
                && !this.cards[index].isDrawCardCheck()) {
                this.cards[index].setVisible(false);
                this.cards[index].setSelected(false);
            }
        }
    }

    /**
     * Updates the visual representation of the draw cards taking into consideration the card which
     * has just been removed.
     * @param removedDraw the position of the removed draw card.
     * @param newDrawCards a list of the new draw cards.
     */
    updateDraws(removedDraw: Pos2D, newDrawCards: Array<Card>) {
        let drawCards: Array<ViewCard> = this.getDrawCards();
        // updates the card which has been removed
        let removedCard:ViewCard = null;
        // iterates over all the draw cards to find the one which has been removed
        for (let index = 0 ; index < drawCards.length; index++) {
            if (drawCards[index].getPyramidPosition().equals(removedDraw)) {
                removedCard = drawCards[index];
            }
        }

        let replacementCard: Card = newDrawCards[removedCard.getPyramidPosition().getX()];
        removedCard.setLabel(replacementCard.toString());
        removedCard.setSelected(false);

        // resets the indexes to match the given draw card list
        for (let index = 0; index < drawCards.length; index++) {
            drawCards[index].setPyramidPosition(new Pos2D(
                newDrawCards.indexOf(this.getMatchingCard(
                    drawCards[index].getLabel(), newDrawCards)), -1));
        }
    }

    /**
     * Sets all of the viewCards with the given positions to be deselected.
     * @param cardPositions the positions to deselect
     */
    deselect(cardPositions: Array<Pos2D>): void {
        // iterates over the viewCards and deselects the ones with the given positions
        for (let index = 0; index < this.cards.length; index++) {
            for (let posIndex = 0 ; posIndex < cardPositions.length; posIndex++) {
                if (cardPositions[posIndex].equals(this.cards[index].getPyramidPosition())) {
                    this.cards[index].setSelected(false);
                }
            }
        }
    }


    printMessage(message: String): void {
        this.context.fillStyle = "#020101";
        this.context.fillText(<string>message, 30, 550);
    }

    /**
     * Updates the score of the game to be rendered by the view for the user to see.
     * @param score the score to be rendered
     */
    updateScore(score: number): void {
        this.score = score;
    }

    /**
     * Handles mouseEvents for the visual view of the game of solitaire.
     * @param e the mouseEvent
     */
    mouseListener(e: MouseEvent): void { // may need to use an altered position
        let pageOffset: number = 32;
            this.selectCard(e.pageX, e.pageY-pageOffset);
            this.refresh();


    }

    /**
     * Handles action events for the remove selected button of this view.
     * @param e the action event.
     */
    private removeButtonActionListener(e: Event): void {
        this.controller.removeSelected(this.getSelectedCards());
        this.resetSelected();
    }

    /**
     * Handles action events for the rules button of this view.
     * @param e the action event.
     */
    private rulesButtonActionListener(e: Event): void {
        alert("The goal of a game of pyramid solitaire is to clear " +
            "the pyramid by removing the cards one or two at a time.\n To remove a card or pair of " +
            "cards the value(s) of the card(s) must sum to 13.\n You may use draw cards paired with " +
            "pyramid cards, or discard any draw card and it will be replaced by the next in the deck.  \n" +
            " The score represents the sum of the " +
            "values of the cards in the pyramid, so the goal, like in golf, " +
            "is to get the lowest score possible.\n A score of zero wins the game.");
    }

    /**
     * Returns the positions of the cards in this panel that have been selected by the user.
     * @return an array of the positions of the selected cards in this panel.
     */
    private getSelectedCards(): Array<Pos2D> {
        let pyramidPositions: Array<Pos2D> = new Array<Pos2D>();
        // iterates over all the viewCards and adds the selected ones to the result
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].getSelected()) {
                pyramidPositions.push(this.cards[index].getPyramidPosition());
            }
        }
        return pyramidPositions;
    }

    /**
     * Sets this view's selected and drawsSelected field back to zero.
     */
    private resetSelected(): void {
        this.selected = 0;
        this.drawsSelected = 0;
    }


    /**
     * Selects the card containing the given x and y positions on the screen, if there is no card with the given
     * position, does nothing.
     * @param screenX the x position on the screen of the card we are selecting
     * @param screenY the y position on the screen of the card we are selecting
     */
    selectCard(x: number, y: number): void {
        for (let index = 0 ; index < this.cards.length ; index ++) {
            let card: ViewCard = this.cards[index];
            // checks if if the card clicked is card, and if that card is uncovered
            if (x > card.getScreenPosition().getX() && x < card.getScreenPosition().getX() + 60 &&
                y > card.getScreenPosition().getY() && y < card.getScreenPosition().getY() + 70 - 10
               && this.notCovered(card.getPyramidPosition(), card.isDrawCardCheck())) {
                // toggles the card selected status
                if (card.getSelected()) { // if the card is already selected
                    this.selected--;
                    if (card.isDrawCardCheck()) {
                        this.drawsSelected--;
                    }
                    card.setSelected(!card.getSelected());
                } else if ( // if the card is not selected
                    (this.selected < 2  && card.getVisible()) && //the card is valid and less than 2 cards are selected
                    ((!card.isDrawCardCheck()) || // the card is not a draw
                    (card.isDrawCardCheck() && this.drawsSelected < 1 ))) { // the card is a draw and can be selected
                    this.selected++;
                    if (card.isDrawCardCheck()) {
                        this.drawsSelected++;
                    }
                    card.setSelected(!card.getSelected());
                }


            }
        }
    }

    /**
     * Gets the card containing the given x and y positions on the screen, returns null if there is none.
     * @param screenX the x position on the screen of the card we are getting
     * @param screenY the y position on the screen of the card we are getting
     * @return the card in this panel containing given position on the screen
     */
    getCard(x: number, y: number): ViewCard {
        this.cards.forEach(function (card) {
            // checks if the card contains the given x, y coordinates
            if (x > card.getScreenPosition().getX() && x < card.getScreenPosition().getX() + 60 &&
                y > card.getScreenPosition().getY() && y < card.getScreenPosition().getY() + 70 - 10) {
                // returns a copy of the card if it is the one with the given coordinates
                 let result: ViewCard = new ViewCard(card.getScreenPosition(), card.getPyramidPosition(),
                    <string>card.getLabel(), card.isDrawCardCheck());
                result.setSelected(card.getSelected());
                result.setVisible(card.getVisible());
                return result;

            }
        });
        return null;
    }

    /**
     * Returns a list of all the cards that are labeled drawCards from this drawingPanel's cards.
     *
     * @return a list of all this panel's drawCards.
     */
    private getDrawCards(): Array<ViewCard> {
        let drawCards: Array<ViewCard> = new Array<ViewCard>();
        // iterates over the viewCards and adds the drawCards to the result
        for (let index = 0; index < this.cards.length; index++) {
            if (this.cards[index].isDrawCardCheck()) {
                drawCards.push(this.cards[index]);
            }
        }
        return drawCards;
    }

    /**
     * Returns the card from the list of cards with the toString result that matches the given label.
     *
     * @param label the label being searched for
     * @param cards the cards being searched through
     * @return the card with the matching label from the given list
     * @throws IllegalArgumentException if a card with the given label does not exist
     */
    private getMatchingCard(label: String, cards: Array<Card>): Card {
        for (let index = 0; index < cards.length; index++) {
            if (cards[index].toString() == label) {
                return cards[index];
            }
        }
        throw new Error("No card with the given label, " + label);
    }

    /**
     * Whether the card at the given pyramid position in the pyramid is uncovered, meaning the cards below and to the
     * left and below and to the right of the pyramid position are invisible. If the card is a drawCard it is alwaus
     * uncovered because there are no cards beneath it.
     *
     * @param pyramidPosition the position in question
     * @param isDrawCard      whether the given card is a drawCard
     * @return whether the card with the given attributes is uncovered in the pyramid
     */
    private notCovered(pyramidPosition: Pos2D, isDrawCard: boolean): boolean {
        // if the card is a drawCard return true
        if (isDrawCard) {
            return true;
        }
        // the positions below the given position
        let botLeft: Pos2D = new Pos2D(pyramidPosition.getX() + 1, pyramidPosition.getY());
        let botRight: Pos2D = new Pos2D(pyramidPosition.getX() + 1, pyramidPosition.getY() + 1);

        // iterates over the viewCards and checks if the ones below the given index are visible
        for (let index=0; index < this.cards.length; index ++) {
            let viewCard = this.cards[index];
            if ((viewCard.getPyramidPosition().equals(botLeft)
                || viewCard.getPyramidPosition().equals(botRight))
                && viewCard.getVisible() && !viewCard.isDrawCardCheck()) {
                return false;
            }
        }

        return true;
    }
    
    
}
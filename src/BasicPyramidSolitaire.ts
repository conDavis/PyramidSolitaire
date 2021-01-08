import {Card} from "./Card";
import {AbstractSinglePyramidSolitaireModel} from "./AbstractSinglePyramidSolitaireModel";

/**
 * Represents the model of a game of pyramid solitaire, which is a game of solitaire in which the
 * cards are dealt into a pyramid shaped arrangement before playing. Holds all of the functionality
 * for the game including the dealing of cards, removal of cards, and the discarding of cards based
 * on the rules of this game.
 * <p> Cards may be removed in singles or as pairs with one card being from the pyramid of
 * cards and one being from the draw cards, or both cards being from the pyramid. The goal of the
 * game is to remove as many cards as possible, because to win the game all cards must be removed.
 * The game ends when there are no more possible removals, no more draws which can be discarded, or
 * the game has been won. </p>
 */
export class BasicPyramidSolitaire extends AbstractSinglePyramidSolitaireModel {

    /**
     * Constructs a {@code BasicPyramidSolitaire} object.
     */
    constructor() {
        // instantiates GameStart to be not yet started.
        super();
    }

    getPyramid(): Array<Array<Card>> {
        let result: Array<Array<Card>> = new Array<Array<Card>>();
        this.pyramid.forEach(function (row) {
            let rowCopy: Array<Card> = new Array<Card>();
            row.forEach(function (card) {
                rowCopy.push(card);
            })
            result.push(rowCopy);
        })
        return result;
    }
}
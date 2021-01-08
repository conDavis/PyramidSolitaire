import {AbstractPyramidSolitaire} from "./AbstractPyramidSolitaire";
import {Card} from "./Card";
import {Suit} from "./Suit";

/**
 * Represents the abstract functionality for a game of PyramidSolitaire, specifically the
 * functionality for games with boards in the shape of a single pyramid.
 */
export abstract class AbstractSinglePyramidSolitaireModel extends AbstractPyramidSolitaire {

    /**
     * Return a valid and complete deck of cards for a game of Pyramid Solitaire. There is no
     * restriction imposed on the ordering of these cards in the deck. The validity of the deck is
     * determined by the rules of the specific game in the classes implementing this interface.
     *
     * @return the deck of cards as a list
     */
    getDeck(): Array<Card> {
        let deck: Array<Card> = new Array<Card>();
        // creates an array containing all of the suits
        let suits: Array<Suit> = new Array<Suit>();
        suits.push(Suit.HEART);
        suits.push(Suit.SPADE);
        suits.push(Suit.CLUB);
        suits.push(Suit.DIAMOND);
        // Creates cards with every value and suit
        suits.forEach(function(suit){
            for (let x = 1; x < 14; x++) {
                deck.push(new Card(suit, x));
            }
        });
        return deck;
    }

    protected dealCards(numRows: number, deck: Array<Card>, shuffle:boolean) {
        let result: Array<Array<Card>> = new Array<Array<Card>>();

        // iterates over all the row indexes and creates rows for them
        for (let rowIndex = 0; rowIndex < numRows; rowIndex += 1) {
            let row: Array<Card> = new Array<Card>();
            result.push(row);
        }

        // shuffles the deck if indicated
        if (shuffle) {
            this.shuffle(deck);
        }

        // adds all the cards necessary for a pyramid of the given size to the result from the deck
        for (let row = 0; row < numRows; row += 1) {
            for (let card = 0; card <= row; card += 1) {
                result[row].push(deck[0]);
                deck.shift();
            }
        }
        return result;
    }


    protected isValidDeck(deck: Array<Card>): boolean {
        // iterates over every possible pairing of the cards in the given deck to check for
        // duplicates.
        for (let index = 0; index < deck.length; index += 1) {
            for (let jindex = 0; jindex < deck.length; jindex += 1) {
                if (index != jindex && deck[index].equals(deck[jindex])) {
                    return false;
                }

            }
            // checks if any card in the given deck is null
            if (deck[index] == null) {
                return false;
            }
        }
        // checks that the given deck is of the same size as a valid deck for this game
        return deck.length == this.getDeck().length;
    }

    protected isEnoughCards(deckSize: number, numRows: number, numDraws: number): boolean {
        let pyramidSize: number = (numRows * (numRows + 1)) / 2;
        return pyramidSize + numDraws <= deckSize;
    }

    shuffle(array: Array<any>): Array<any> {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


}
import {Suit} from "./Suit";

/**
 * Represents a card in a standard deck of 52 with a suit and a value.
 */
export class Card {
    private suit : Suit;
    value : number;

    /**
     * Constructs a {@code Card} object.
     *
     * @param suit  the suit of the card
     * @param value the numerical value of the card
     */
    constructor(suit:Suit, value:number) {
        this.suit = suit;
        this.value = value;
    }

    /**
     * Returns the value of this card.
     *
     * @return the value field of this card
     */
    getValue(): number {
        return this.value;
    }

    /**
     * Equality check for a given object and this Card, returns true if the given object is a Card,
     * and all the attributes of the given Card are the same as this card.
     * @param obj the object to be checked for equality with this one
     */
    equals(obj: any): boolean {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Card)) {
            return false;
        }
        let that : Card = <Card> obj;
        return this.value == that.value &&
            this.suit == that.suit;
    }

     toString(): string {
        if (this.value == 1) {
            return "A" + this.suit.toString();
        } else if (this.value == 11) {
            return "J" + this.suit.toString();
        } else if (this.value == 12) {
            return "Q" + this.suit.toString();
        } else if (this.value == 13) {
            return "K" + this.suit.toString();
        } else {
            return "" + this.value + this.suit.toString();
        }
    }




}
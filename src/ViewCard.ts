import {Pos2D} from "./Pos2D";

/**
 * Represents a drawable card for a visual view of a game of solitaire.
 */
export class ViewCard {
    private selected: boolean;
    private visible: boolean;
    private screenPos: Pos2D;
    private pyramidPos: Pos2D;
    private label: String;
    private readonly isDrawCard: boolean;
    readonly CARD_WIDTH = 60;
    readonly CARD_HEIGHT = 70;

    /**
     * Creates a viewCard object with the given attributes.
     * @param screenPos the position of the card on the screen.
     * @param pyramidPos the position of the card in the pyramid.
     * @param label the label of the card.
     * @param isDrawCard whether the card to be created is a drawCard.
     */
    constructor(screenPos: Pos2D, pyramidPos: Pos2D, label: string, isDrawCard: boolean) {
        this.selected = false;
        this.visible = true;
        this.screenPos = screenPos;
        this.pyramidPos = pyramidPos;
        this.label = label;
        this.isDrawCard = isDrawCard;
    }


    /**
     * Renders this viewCard with the given graphics.
     *
     * @param context the graphics to be rendered with.
     */
    render(context: CanvasRenderingContext2D): void {
        context.font = "25px Veranda"
        if (this.visible) { // if the card is visible
            if (this.selected) { // if the card is selected
                // renders the card
                context.fillStyle = "#65b577";
                context.fillRect(this.screenPos.getX(), this.screenPos.getY(),
                    this.CARD_WIDTH, this.CARD_HEIGHT);
                // renders the accents and label
                context.fillStyle = "#064112";
                context.strokeRect(this.screenPos.getX(), this.screenPos.getY(),
                    this.CARD_WIDTH, this.CARD_HEIGHT);
                // might need to add font styling here

                context.fillText(<string>this.label, this.screenPos.getX() + this.CARD_WIDTH / 4,
                    this.screenPos.getY() + this.CARD_HEIGHT / 2);

            } else { // if the card is not selected
                // renders the card
                context.fillStyle = "#ffffff";
                context.fillRect(this.screenPos.getX(), this.screenPos.getY(),
                    this.CARD_WIDTH, this.CARD_HEIGHT);
                // renders the accents and label
                if (this.redSuit(this.label)) {
                    context.fillStyle = "#ef0707";
                } else {
                    context.fillStyle = "#000000";
                }
                context.strokeRect(this.screenPos.getX(), this.screenPos.getY(),
                    this.CARD_WIDTH, this.CARD_HEIGHT);
                // might need to add font styling here
                context.fillText(<string>this.label, this.screenPos.getX() + this.CARD_WIDTH / 4,
                    this.screenPos.getY() + this.CARD_HEIGHT / 2);
            }
        } else { // if the card is not visible
            if (this.redSuit(this.label)) {
                context.fillStyle = "#ef0707";
            } else {
                context.fillStyle = "#000000";
            }
            context.strokeRect(this.screenPos.getX(), this.screenPos.getY(),
                this.CARD_WIDTH, this.CARD_HEIGHT);

        }
    }

    setSelected(selected: boolean): void {
        this.selected = selected;
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
    }

    setPyramidPosition(pyramidPosition: Pos2D): void {
        this.pyramidPos = pyramidPosition;
    }

    setLabel(label: string): void {
        // checks if the given label is null
        if (label == null) {
            throw new Error("The given label cannot be null.");
        }
        this.label = label;
    }

    getScreenPosition(): Pos2D {
        // returns copy to disallow mutation
        return new Pos2D(this.screenPos.getX(), this.screenPos.getY());
    }

    getPyramidPosition(): Pos2D {
        // returns copy to disallow mutation
        return new Pos2D(this.pyramidPos.getX(), this.pyramidPos.getY());
    }

    getSelected(): boolean {
        return this.selected;
    }

    getVisible(): boolean {
        return this.visible;
    }

    getLabel(): String {
        return this.label;
    }

    isDrawCardCheck(): boolean {
        return this.isDrawCard;
    }

    /**
     * Returns the type of the card in the form of a string, one of: "♥", "♠", "♣", "♦".
     * @param card the card whose type will be returned.
     * @return the type of the card in the form of a string.
     */
    private suitType(card: ViewCard): string {
        return card.getLabel().substring(card.getLabel().length-1);
    }

    private redSuit(type: String): boolean {
        return (type.substring(type.length-1).localeCompare("♥") == 0 ||
            type.substring(type.length-1).localeCompare("♦") == 0);
    }








}
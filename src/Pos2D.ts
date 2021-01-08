/**
 * Represents an (x, y) position on the cartesian plane.
 */
export class Pos2D {
    private readonly x: number;
    private readonly y: number;

    /**
     * Creates a Pos2D object.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns the x plane value of this position.
     *
     * @return the x plane coordinate of this position
     */
    getX(): number {
        return this.x;
    }

    /**
     * Returns the y plane value of this position.
     *
     * @return the y plan coordinate of this position
     */
    getY(): number {
        return this.y;
    }

    /**
     * Equality check for a given object and this Pos2D, returns true if the given object is a Pos2D,
     * and all the attributes of the given Pos2D are the same as this pos.
     * @param obj the object to be checked for equality with this one
     */
    equals(obj: any): boolean {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Pos2D)) {
            return false;
        }
        let that: Pos2D = <Pos2D> obj;
        return this.x == that.x
            && this.y == that.y;
    }


}
package bg.fmi.polyhub.dto.policy;

public enum PoliticalPositionType {

    LEFT_LIBERAL,
    LEFT_CONSERVATIVE,
    RIGHT_LIBERAL,
    RIGHT_CONSERVATIVE;

    public static PoliticalPositionType from(Double economic, Double social) {
        if (economic == null || social == null) return null;

        boolean isLeft = economic < 0;
        boolean isLiberal = social > 0;

        if (isLeft && isLiberal) return LEFT_LIBERAL;
        if (isLeft) return LEFT_CONSERVATIVE;
        if (isLiberal) return RIGHT_LIBERAL;
        return RIGHT_CONSERVATIVE;
    }
}

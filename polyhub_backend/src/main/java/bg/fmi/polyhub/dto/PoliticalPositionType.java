package bg.fmi.polyhub.dto;

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

    public static String toSimpleLabel(Double economic, Double social) {
        if (economic == null || social == null) return null;
        double t = 0.15;
        boolean econStrong   = Math.abs(economic) >= t;
        boolean socialStrong = Math.abs(social)   >= t;
        if (!econStrong && !socialStrong) return "center";
        String econLabel   = economic < 0 ? "left" : "right";
        String socialLabel = social   > 0 ? "liberal" : "conservative";
        if (econStrong && socialStrong) return econLabel + "-" + socialLabel;
        if (econStrong)  return econLabel;
        return socialLabel;
    }
}

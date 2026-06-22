package bg.fmi.polyhub.utils;

import bg.fmi.polyhub.entities.Election;

import java.time.LocalDate;

public final class ElectionStatusUtils {

    private ElectionStatusUtils() {
    }

    public static String getStatus(Election election) {
        LocalDate today = LocalDate.now();

        if (election.getElectionDate().isBefore(today)) {
            return "FINISHED";
        }

        if (election.getElectionDate().isEqual(today)) {
            return "RUNNING";
        }

        return "UPCOMING";
    }

    public static boolean isFinished(Election election) {
        return "FINISHED".equals(getStatus(election));
    }
}
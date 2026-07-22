package it.andreamoiochef.backend.common;

import java.text.Normalizer;
import java.util.regex.Pattern;

/** Genera slug URL-friendly (minuscolo, senza accenti, separati da trattini) da un testo libero. */
public final class SlugUtil {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9\\s-]");
    private static final Pattern MULTIPLE_SEPARATORS = Pattern.compile("[\\s-]+");

    private SlugUtil() {
    }

    public static String slugify(String input) {
        if (input == null) {
            return "";
        }
        String noAccents = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String lower = noAccents.toLowerCase().trim();
        String cleaned = NON_ALPHANUMERIC.matcher(lower).replaceAll("");
        String hyphenated = MULTIPLE_SEPARATORS.matcher(cleaned).replaceAll("-");
        return hyphenated.replaceAll("^-|-$", "");
    }
}

package it.andreamoiochef.backend.content.dto;

import it.andreamoiochef.backend.content.SiteSettings;

public record SiteSettingsDto(
        String brandName,
        String brandHandle,
        String brandRole,
        String brandCity,
        String brandPayoff,
        String logoUrl,
        String faviconUrl,
        String contactEmail,
        String whatsappNumber,
        String whatsappLink,
        String contactArea,
        String mapAddress,
        String instagramUrl,
        String facebookUrl,
        String tiktokUrl,
        String threadsUrl,
        String heroTitle,
        String heroSubtitle,
        String heroImageUrl,
        String aboutIntro,
        String aboutParagraph1,
        String aboutParagraph2,
        String aboutImageUrl,
        String statYearsValue,
        String statYearsLabel,
        String statEventsValue,
        String statEventsLabel,
        String statIngredientsValue,
        String statIngredientsLabel
) {
    public static SiteSettingsDto fromEntity(SiteSettings s) {
        return new SiteSettingsDto(
                s.getBrandName(), s.getBrandHandle(), s.getBrandRole(), s.getBrandCity(), s.getBrandPayoff(),
                s.getLogoUrl(), s.getFaviconUrl(),
                s.getContactEmail(), s.getWhatsappNumber(), s.getWhatsappLink(), s.getContactArea(), s.getMapAddress(),
                s.getInstagramUrl(), s.getFacebookUrl(), s.getTiktokUrl(), s.getThreadsUrl(),
                s.getHeroTitle(), s.getHeroSubtitle(), s.getHeroImageUrl(),
                s.getAboutIntro(), s.getAboutParagraph1(), s.getAboutParagraph2(), s.getAboutImageUrl(),
                s.getStatYearsValue(), s.getStatYearsLabel(),
                s.getStatEventsValue(), s.getStatEventsLabel(),
                s.getStatIngredientsValue(), s.getStatIngredientsLabel()
        );
    }

    /** Applica i valori del DTO all'entity esistente (update in place). */
    public void applyTo(SiteSettings s) {
        s.setBrandName(brandName);
        s.setBrandHandle(brandHandle);
        s.setBrandRole(brandRole);
        s.setBrandCity(brandCity);
        s.setBrandPayoff(brandPayoff);
        s.setLogoUrl(logoUrl);
        s.setFaviconUrl(faviconUrl);
        s.setContactEmail(contactEmail);
        s.setWhatsappNumber(whatsappNumber);
        s.setWhatsappLink(whatsappLink);
        s.setContactArea(contactArea);
        s.setMapAddress(mapAddress);
        s.setInstagramUrl(instagramUrl);
        s.setFacebookUrl(facebookUrl);
        s.setTiktokUrl(tiktokUrl);
        s.setThreadsUrl(threadsUrl);
        s.setHeroTitle(heroTitle);
        s.setHeroSubtitle(heroSubtitle);
        s.setHeroImageUrl(heroImageUrl);
        s.setAboutIntro(aboutIntro);
        s.setAboutParagraph1(aboutParagraph1);
        s.setAboutParagraph2(aboutParagraph2);
        s.setAboutImageUrl(aboutImageUrl);
        s.setStatYearsValue(statYearsValue);
        s.setStatYearsLabel(statYearsLabel);
        s.setStatEventsValue(statEventsValue);
        s.setStatEventsLabel(statEventsLabel);
        s.setStatIngredientsValue(statIngredientsValue);
        s.setStatIngredientsLabel(statIngredientsLabel);
    }
}

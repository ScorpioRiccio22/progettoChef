package it.andreamoiochef.backend.leads.dto;

import it.andreamoiochef.backend.leads.ContactMessage;

import java.time.LocalDateTime;

public record ContactMessageDto(
        Long id,
        String name,
        String email,
        String phone,
        String subject,
        String message,
        boolean read,
        LocalDateTime createdAt
) {
    public static ContactMessageDto fromEntity(ContactMessage m) {
        return new ContactMessageDto(
                m.getId(), m.getName(), m.getEmail(), m.getPhone(),
                m.getSubject(), m.getMessage(), m.isRead(), m.getCreatedAt()
        );
    }
}

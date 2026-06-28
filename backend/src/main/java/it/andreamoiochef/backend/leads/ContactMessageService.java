package it.andreamoiochef.backend.leads;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.leads.dto.ContactMessageDto;
import it.andreamoiochef.backend.leads.dto.ContactMessageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;

    /** Riceve un messaggio dal form pubblico di contatto. */
    @Transactional
    public void submit(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name());
        message.setEmail(request.email());
        message.setPhone(request.phone());
        message.setSubject(request.subject());
        message.setMessage(request.message());
        repository.save(message);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageDto> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(ContactMessageDto::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countUnread() {
        return repository.countByReadFalse();
    }

    @Transactional
    public ContactMessageDto markAsRead(Long id, boolean read) {
        ContactMessage message = findOrThrow(id);
        message.setRead(read);
        return ContactMessageDto.fromEntity(repository.save(message));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(findOrThrow(id));
    }

    private ContactMessage findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Messaggio non trovato (id " + id + ")"));
    }
}

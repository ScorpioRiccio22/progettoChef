package it.andreamoiochef.backend.leads;

import it.andreamoiochef.backend.common.NotFoundException;
import it.andreamoiochef.backend.leads.dto.NewsletterSubscriberDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsletterSubscriberService {

    private final NewsletterSubscriberRepository repository;

    /**
     * Iscrive un'email alla newsletter. Idempotente: se l'email è già
     * iscritta, l'operazione non fallisce e non duplica la riga.
     */
    @Transactional
    public void subscribe(String email) {
        if (repository.existsByEmailIgnoreCase(email)) {
            return;
        }
        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        repository.save(subscriber);
    }

    @Transactional(readOnly = true)
    public List<NewsletterSubscriberDto> listAll() {
        return repository.findAllByOrderBySubscribedAtDesc().stream()
                .map(NewsletterSubscriberDto::fromEntity)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        NewsletterSubscriber subscriber = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Iscritto non trovato (id " + id + ")"));
        repository.delete(subscriber);
    }
}

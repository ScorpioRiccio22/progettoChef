package it.andreamoiochef.backend.leads;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    List<NewsletterSubscriber> findAllByOrderBySubscribedAtDesc();

    boolean existsByEmailIgnoreCase(String email);

    Optional<NewsletterSubscriber> findByEmailIgnoreCase(String email);
}

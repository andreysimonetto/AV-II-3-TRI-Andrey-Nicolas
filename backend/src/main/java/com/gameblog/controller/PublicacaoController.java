package com.gameblog.controller;

import java.util.List;

import com.gameblog.exception.PublicacaoNaoEncontradaException;
import com.gameblog.model.Publicacao;
import com.gameblog.repository.PublicacaoRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicacoes")
@CrossOrigin(origins = "${GAMEBLOG_FRONTEND_ORIGIN:http://127.0.0.1:5500}")
public class PublicacaoController {
    private final PublicacaoRepository repository;

    public PublicacaoController(PublicacaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Publicacao> listar() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @GetMapping("/{id}")
    public Publicacao buscar(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(PublicacaoNaoEncontradaException::new);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Publicacao criar(@Valid @RequestBody Publicacao publicacao) {
        return repository.save(publicacao);
    }
}

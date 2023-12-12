// importar bibliotecas
const express = require('express')
const bibliotecapg = require('pg')
// conexão do objeto com o servidor
const client = new bibliotecapg.Client({connectionString: "postgres://bvhjonhk:7gylLBTP5LiWgf7GE9hAzzx6PxeZ_u-P@isabelle.db.elephantsql.com/bvhjonhk"})
const app = express()
const port = 3000

// consultas no banco de dados:

 // Rosca 1 - Número de alunos reprovados em cada matéria.
const consulta1 = `
SELECT m.nome_materia, COUNT(reprovados.RA) AS numero_de_reprovados
FROM materia m
RIGHT JOIN avaliacao ON m.id_materia = avaliacao.id_materia
JOIN reprovados ON avaliacao.RA = reprovados.RA
GROUP BY m.nome_materia;
`
// Rosca 2 - quantidade de funcionarios concursados por região
const consulta2 = `
select ee.regiao, count(c.id_funcionario) as quantidade_funcionario
from funcionario f
join concursado c on f.id_funcionario = c.id_funcionario
join escola e on e.id_escola = f.id_escola
join endereco_escola ee on e.id_endereco_escola = ee.id_endereco_escola
group by regiao;
` 
// Rosca 3 - buscar a quantidade de funcionarios que tenham como cargo Diretor, Zelador e Secretário em todas as escolas.
const consulta3 = `
select c.nome_cargo, count(f.id_funcionario) as quantidade_funcionario
from funcionario f
join cargo c on c.id_cargo = f.id_cargo
where nome_cargo in ('Diretor', 'Zelador', 'Secretario')
group by nome_cargo;
`
// Pizza - Cálcule a media das notas dos alunos por região
const consulta4 = `
SELECT ea.regiao, AVG(CAST(ma.media AS DECIMAL)) as media_notas
FROM aluno a
JOIN endereco_aluno ea ON a.id_endereco_aluno = ea.id_endereco_aluno
JOIN avaliacao av ON a.RA = av.RA
JOIN media_alunos ma ON av.id_avaliacao = ma.id_avaliacao
GROUP BY ea.regiao;
`
// Barra 1 - Busque media e o nome da avaliação do alunos aprovados
const consulta5 = `
SELECT a2.nome_avaliacao, media
FROM media_alunos
JOIN aprovado a on media_alunos.id_media = a.id_media
join public.avaliacao a2 on a2.id_avaliacao = media_alunos.id_avaliacao
ORDER BY media;
`
// Linha - busque todas as médias de todos alunos.
const consulta6 = `
select media
from media_alunos
order by media;
`
// ** Barra 2 - Quantidade de alunos por cor em cada escola **
const consulta7 = `
select  a.cor, count(a.ra) as numero_alunos
from escola e
left join aluno a on e.id_escola = a.id_escola
group by e.nome_escola, a.cor;
`
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/consulta1', (requesicao, resposta) => {

    client.connect((err) => {
        client.query(consulta1, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res) 
        })
    })

})

app.get('/consulta2', (requisicao, resposta) => {

    client.connect((err) => {
        client.query(consulta2, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res) 
        })
    })
})

app.get('/consulta3', (requisicao, resposta) => {

    client.connect((err) => {
        client.query(consulta3, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res) 
        })
    })
})

app.get('/consulta4', (requisicao, resposta) => {

    client.connect((err) => {
        client.query(consulta4, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res) 
        })
    })
})

app.get('/consulta5', (requisicao, resposta) => {

    client.connect((err) => {
        client.query(consulta5, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res) 
        })
    })
})

app.get('/consulta6', (requisicao, resposta) => {

    client.connect((err) => {
        client.query(consulta6, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res) 
        })
    })
})

app.get('/consulta7', (requisicao, resposta) => {

    client.connect((err) => {
        client.query(consulta7, (err, res) => {
            resposta.send(JSON.stringify(res.rows))
            console.log(err ? err.stack : res)
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})  
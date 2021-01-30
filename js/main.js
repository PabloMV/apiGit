$uname = undefined
$reposNum = undefined
$pagStart = 1
$pagLast = undefined


$('#search').on('click', (e) => {
    e.preventDefault()
    $pagStart = 1
    $uname = $('#uname').val()
    $.ajax({
        url: `https://api.github.com/users/${$uname}`,//consulta de usuário
        type: 'get',
        headers: {
            "accept": "application/vnd.github.v3+json"
        },

        success: (res) => {
            $reposNum = res.public_repos
            console.log(res)
            console.log("numero de repositórios: " + $reposNum)
            $.ajax({
                url: res.avatar_url,//apos carregamento de imagem, mostrar conteúdo
                type: 'get',
                complete: () => {
                    if (res.name === null) {
                        res.name = "Nome Não Cadastrado Pelo Usuário"
                    }
                    if (res.bio === null) {
                        res.bio = ""
                    }
                    $('main.container').hide(),
                        $('main.container').html(`<div class="card" style="width: 18rem;">
                                        <img class="card-img-top" src="${res.avatar_url}" alt="Card image cap">
                                        <div class="card-body">
                                            <h5 class="card-title">${res.name}</h5>
                                            <p class="card-text">${res.bio}</p>
                                            <a class="card-text"><a href="${res.html_url}" target="_blank">Acessar Perfil</a></p>
                                            <div class="btn-wrapper d-flex">
                                            <button id="repos" class="btn btn-success w-50 mx-1" onclick="lists(this);" data-bs-toggle="modal" data-bs-target="#staticBackdrop">REPOS</button><button id="starred" class="btn btn-success w-50 mx-1" onclick="lists(this);" data-bs-toggle="modal" data-bs-target="#staticBackdrop">STARRED</button>
                                            </div>
                                        </div>
                                      </div>`)
                    $('main.container').fadeIn('slow')
                    $pagLast = Math.floor($reposNum / 50) //paginação
                    console.log(`paginas :${$pagLast}`)
                }
            })
        },
        error: () => {
            alert('Nome de Usuário Não encontrado! Tente Novamente')
        }
    })
})

function lists(btn) {//listar repositórios
    console.log(btn)
    if ($(btn).attr('id') === "repos") {
        $url = `https://api.github.com/users/${$uname}/repos?page=${$pagStart}&per_page=50`
        $hmsg = `Usuário não Possuí Repositórios Cadastrados!`
    }
    if ($(btn).attr('id') === "starred") {
        $url = `https://api.github.com/users/${$uname}/starred`
        $hmsg = `Usuário não Possuí Repositórios Marcados Com Estrela!`
    }
    $.ajax({
        url: $url,
        type: 'get',
        headers: {
            "accept": "application/vnd.github.v3+json"
        },
        success: (res) => {

            if (res.length === 0) {
                $('.modal-header h4').text($(btn).attr('id').toUpperCase())
                $('.modal-header h5').text($hmsg)
                $('.modal-body ul').html('')
                $('.modal-footer .pagination').html('')
            } else {
                $('.modal-header h4').text($(btn).attr('id').toUpperCase())
                $('.modal-body ul').html('')
                
                res.forEach(uplist)
                function uplist(item, index) {
                   
                    $('.modal-header h5').text(`Repositórios do Usuário(${$reposNum}) Página (${$pagStart}/${$pagLast-1})`);
                    $('.modal-body ul').append(`<li class="list-group-item">Nome: <b>${item.name}</b>   <a href="${item.html_url}" target="_blank" >Acessar Aqui</a></li>`)
                    console.log(item, index)
                }
                if ($pagLast > 0) {
                    $('.modal-footer .pagination').html('')
                    for (var i = 1; i < $pagLast; i++) {
                        $('.modal-footer .pagination').append(`<li class="page-item"><a id="repos" data-index=${i} class="page-link" onclick="pag(this)" >${(i)}</a></li>`)
                    }
                } else {
                    $('.modal-footer .pagination').html('')
                }
            }
            console.log(res)
        }
    })
}

function pag(params) {//carregar paginação
    $('.modal-body ul').html('')
    document.getElementById('staticBackdrop').scrollIntoView()
    $pagStart = Number($(params).attr('data-index'))
    lists($(params))
    console.log($(params).attr('data-index'))
}

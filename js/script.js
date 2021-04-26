window.addEventListener('DOMContentLoaded', () => {

    const burger = document.querySelector('.header__burger'),
        header = document.querySelector('.header'),
        headerMenuClose = document.querySelector('.header__menu__close'),
        map = document.querySelector('#map'),
        links = document.querySelectorAll('[href^="#"]'),
        ageButtonYes = document.querySelector('.age__button--yes'),
        ageButtonNo = document.querySelector('.age__button--no'),
        ageModal = document.querySelector('.age'),
        modalSuccessAge = document.querySelector('.modal-success--age'),
        modalSuccessDialogAge = document.querySelector('.modal-success__dialog--age');

    //Проверка возраста

    if (localStorage.getItem('age') === '>=21') {
        document.body.style.overflow = '';
        ageModal.classList.remove('age--visible');
    } else {
        document.body.style.overflow = 'hidden';
    }
    ageButtonYes.addEventListener('click', () => {
        document.body.style.overflow = '';
        ageModal.classList.remove('age--visible');
        localStorage.setItem('age', '>=21');
    });

    ageButtonNo.addEventListener('click', () => {
        modalSuccessAge.classList.add('modal-success--visible');
    });

    modalSuccessAge.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-success')) {
            modalSuccessAge.classList.remove('modal-success--visible');
        }
    });

    modalSuccessDialogAge.addEventListener('click', () => {
        modalSuccessAge.classList.remove('modal-success--visible');
    });


    // Скролл до якоря

    let speed = 1;

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            let widthTop = document.documentElement.scrollTop,
                hash = this.hash,
                toBlock = document.querySelector(hash).getBoundingClientRect().top,
                start = null;

            requestAnimationFrame(step);

            function step(time) {
                if (start === null) {
                    start = time;
                }

                let progress = time - start,
                    r = (toBlock < 0 ? Math.max(widthTop - progress / speed, widthTop + toBlock) : Math.min(widthTop + progress / speed, widthTop + toBlock));

                document.documentElement.scrollTo(0, r);
                if (r != widthTop + toBlock) {
                    requestAnimationFrame(step);
                } else {
                    location.hash = hash;
                }
            }
        });
    });

    // Функция для слайдера 3d

    function slider3d(imgsSrc, cubes, arrowPrev, arrowNext) {
        const imgsSrc_ = document.querySelectorAll(imgsSrc),
            cubes_ = document.querySelectorAll(cubes),
            prev_ = document.querySelector(arrowPrev),
            next_ = document.querySelector(arrowNext);

        let startPoint,
            swipeAction,
            endPoint,
            angle = 0,
            src = [],
            counter = 0,
            isRight = false,
            isLeft = false;

        if (imgsSrc_.length > 0) {

            const prevSlide = function() {
                counter--;
                if (counter < 0) {
                    counter = 3;
                }
                angle += 90;
                src.unshift(src.pop());
                cubes_.forEach((item, index) => {
                    for (let i = 0; i < item.children.length; i++) {
                        if (i == counter) {
                            item.children[i].firstElementChild.setAttribute('src', `${src[index]}`);
                        }
                    }
                    item.style.transform = `rotateY(${angle}deg)`;
                });
            };

            const nextSlide = function() {
                counter++;
                if (counter > 3) {
                    counter = 0;
                }
                angle -= 90;
                src.push(src.shift());
                cubes_.forEach((item, index) => {
                    for (let i = 0; i < item.children.length; i++) {
                        if (i == counter) {
                            item.children[i].firstElementChild.setAttribute('src', `${src[index]}`);
                        }
                    }
                    item.style.transform = `rotateY(${angle}deg)`;
                });
            };

            cubes_.forEach(item => {

                item.addEventListener('touchstart', (e) => {
                    startPoint = e.changedTouches[0].pageX;
                });

                item.addEventListener('touchmove', (e) => {
                    swipeAction = e.changedTouches[0].pageX - startPoint;
                    item.style.transform = `rotateY(${swipeAction/2.5 + angle}deg)`;
                    if (swipeAction > 0) {
                        if (!isRight) {
                            counter--;
                            if (counter < 0) {
                                counter = 3;
                            }
                            src.unshift(src.pop());
                            cubes_.forEach((item, index) => {
                                for (let i = 0; i < item.children.length; i++) {
                                    if (i == counter) {
                                        item.children[i].firstElementChild.setAttribute('src', `${src[index]}`);
                                    }
                                }
                            });
                            counter++;
                            if (counter > 3) {
                                counter = 0;
                            }
                            src.push(src.shift());
                            isRight = true;
                        }
                    } else {
                        if (!isLeft) {
                            counter++;
                            if (counter > 3) {
                                counter = 0;
                            }
                            src.push(src.shift());
                            cubes_.forEach((item, index) => {
                                for (let i = 0; i < item.children.length; i++) {
                                    if (i == counter) {
                                        item.children[i].firstElementChild.setAttribute('src', `${src[index]}`);
                                    }
                                }
                            });
                            counter--;
                            if (counter < 0) {
                                counter = 3;
                            }
                            src.unshift(src.pop());
                            isLeft = true;
                        }
                    }
                });

                item.addEventListener('touchend', (e) => {
                    endPoint = e.changedTouches[0].pageX;
                    if (Math.abs(startPoint - endPoint) > 50) {
                        isRight = false;
                        isLeft = false;
                        if (endPoint < startPoint) {
                            nextSlide();
                        } else {
                            prevSlide();
                        }
                    } else {
                        item.style.transform = `rotateY(${angle}deg)`;
                    }
                });

            });

            imgsSrc_.forEach(item => {
                src.push(item.getAttribute('src'));
            });

            prev_.addEventListener('click', () => {
                prevSlide();
            });

            next_.addEventListener('click', () => {
                nextSlide();
            });
        }
    }

    slider3d('.questSl__src--1', '.questSl__cube--1', '.questSl__arrow__prev--1', '.questSl__arrow__next--1');
    slider3d('.questSl__src--2', '.questSl__cube--2', '.questSl__arrow__prev--2', '.questSl__arrow__next--2');
    slider3d('.questSl__src--3', '.questSl__cube--3', '.questSl__arrow__prev--3', '.questSl__arrow__next--3');
    slider3d('.questSl__src--4', '.questSl__cube--4', '.questSl__arrow__prev--4', '.questSl__arrow__next--4');
    slider3d('.questSl__src--5', '.questSl__cube--5', '.questSl__arrow__prev--5', '.questSl__arrow__next--5');
    slider3d('.questSl__src--6', '.questSl__cube--6', '.questSl__arrow__prev--6', '.questSl__arrow__next--6');
    slider3d('.questSl__src--7', '.questSl__cube--7', '.questSl__arrow__prev--7', '.questSl__arrow__next--7');
    slider3d('.questSl__src--8', '.questSl__cube--8', '.questSl__arrow__prev--8', '.questSl__arrow__next--8');

    // Функция для появления-скрытия модалки

    function calcScroll() {
        let div = document.createElement('div');

        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        let scarollWidth = div.offsetWidth - div.clientWidth;
        div.remove();

        return scarollWidth;
    }

    let scrollWidth = calcScroll();

    function modal(modal, modalActiveClass, triggers, modalClose) {
        const triggers_ = document.querySelectorAll(triggers),
            modal_ = document.querySelector(modal),
            modalClose_ = document.querySelector(modalClose);

        if (triggers_.length > 0) {
            triggers_.forEach(item => {
                item.addEventListener('click', () => {
                    modal_.classList.add(modalActiveClass);
                    document.body.style.overflow = 'hidden';
                    document.body.style.marginRight = `${scrollWidth}px`;
                });
            });

            modalClose_.addEventListener('click', () => {
                modal_.classList.remove(modalActiveClass);
                document.body.style.overflow = '';
                document.body.style.marginRight = '0px';
            });

            modal_.addEventListener('click', (e) => {
                if (e.target.classList.contains(modal.replace(/\./, ''))) {
                    modal_.classList.remove(modalActiveClass);
                    document.body.style.overflow = '';
                    document.body.style.marginRight = '0px';
                }
            });
        }

        if (window.location.pathname == '/massage/questionnaires.html') {
            modal_.classList.add(modalActiveClass);
            modalClose_.addEventListener('click', () => {
                modal_.classList.remove(modalActiveClass);
                document.body.style.overflow = '';
                document.body.style.marginRight = '0px';
            });
            modal_.addEventListener('click', (e) => {
                if (e.target.classList.contains(modal.replace(/\./, ''))) {
                    modal_.classList.remove(modalActiveClass);
                    document.body.style.overflow = '';
                    document.body.style.marginRight = '0px';
                }
            });
        }

    }

    modal('.modal', 'modal--visible', '[data-modal]', '.modal__close');






    // появление - исчезновение меню на мобилке при нажатии на бургер

    function headerDeleteClass() {
        header.classList.remove('header--absolute');
        document.body.style.paddingTop = '';
    }
    burger.addEventListener('click', () => {
        header.classList.toggle('header--active');
        if (header.classList.contains('header--active')) {
            header.classList.add('header--absolute');
            document.body.style.paddingTop = `${header.firstElementChild.scrollHeight - 3}px`;
        } else {
            setTimeout(headerDeleteClass, 300);
        }
    });
    headerMenuClose.addEventListener('click', () => {
        header.classList.remove('header--active');
        setTimeout(headerDeleteClass, 300);
    });

    //Карта

    if (map) {
        ymaps.ready(function() {
            var myMap = new ymaps.Map('map', {
                    center: [53.195000, 50.107685],
                    zoom: 17
                }, {
                    searchControlProvider: 'yandex#search'
                }),

                // Создаём макет содержимого.
                MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                    '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
                ),

                myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                    hintContent: 'г. Самара, ул. Самарская д. 161а',
                    balloonContent: 'г. Самара, ул. Самарская д. 161а'
                }, {
                    // Опции.
                    // Необходимо указать данный тип макета.
                    iconLayout: 'default#image',
                    // Своё изображение иконки метки.
                    iconImageHref: '../img/map/here.png',
                    // Размеры метки.
                    iconImageSize: [40, 40],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-5, -38]
                });

            myMap.geoObjects
                .add(myPlacemark);
            myMap.behaviors.disable('scrollZoom');
        });
    }

});


// $(document).ready(function() {
//     if (window.location.pathname == '/massage/questionnaires.html') {
//         $('.contacts-modal__load').addClass('active');
//     };
// });
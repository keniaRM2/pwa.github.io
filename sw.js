const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;
//console.log("ServiceWorker");
//Todos aquellos recursos propios de la aplicación
const APP_SHELL = [
    '/',
    '/index.html',
    '/pages/offline.html',
    '/css/styles.css',
    '/img/car2.jpg',
    '/js/app.js'
];
//Todos aquellos recursos que nuncan cambian
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', e => {
    //console.log('Instalado');
    //e.skipWaiting();
    const staticCache = caches.open(STATIC).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const inmutableCache = caches.open(INMUTABLE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', e => {
    console.log('Activado');
});

self.addEventListener('fetch', e => {
    /*console.log(e.request);
    if(e.request.url.includes('car1.jpg'))
        e.respondWith(fetch('img/car2.jpg'))
    else e.respondWith(fetch(e.request))*/
    //1. Cache Only
    //e.respondWith(caches.match(e.request.redirect = APP_SHELL[2]));

    //2. Cache with network fallback
    /*const source = caches.match(e.request).then(res => {
        if(res) return res;
        return fetch(e.request).then(resFetch => {
            caches.open(DYNAMIC).then(cache => {
                cache.put(e.request, resFetch);
            });
            return resFetch.clone();
        });
    });
    e.respondWith(source);*/

    //3. Network with cache fallback
    /*const source = fetch(e.request).then(res => {
        if(!res) throw Error('NotFound');
        //Checar si el recurso ya existe en algún cache
        caches.open(DYNAMIC).then(cache => {
            cache.put(e.request, res);
        });
        return res.clone();
    }).catch(err=>{
        return caches.match(e.request);
    });
    e.respondWith(source);*/

    //4. Cache with nerwork update
    //Rendimiento crítico, si el rendimiento es bajo utilizar.
    //Toda nuestra aplicación está a un paso atrás
    /*if(e.request.url.includes('bootstrap'))
      return e.respondWith(caches.match(e.request));
    const source = caches.open(STATIC).then(cache => {
        fetch(e.request).then(res => {
            cache.put(e.request, res);
        });
        return cache.match(e.request);
    });
    e.respondWith(source);*/

    //5. Cache and network race
    const source = new Promise((resolve, reject) => {
        let rejected = false;
        const failsOnce = () => {
            if (rejected) {
                if (/\.(png|jpg)/i.test(e.request.url)) {
                    resolve(caches.match('/img/not-found.png'));
                }
                //if(e.request.url.includes('page2.html'))
                //  resolve();
            } else {
                rejected = true;
            }
        };
        fetch(e.request).then(res => {
            res.ok ? resolve(res) : failsOnce();
        }).catch(failsOnce);
        caches.match(e.request).then(cacheRes => {
            cacheRes.ok ? resolve(cacheRes) : failsOnce();
        }).catch(failsOnce);
    });
    e.respondWith(source);
});

/*self.addEventListener('push', e => {
    console.log('Notificacion push');
})

self.addEventListener('sync', e => {
    console.log('SYNC EVENT');
})*/
//----------------------------------------
/*const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;
//console.log("ServiceWorker");
//Todos aquellos recursos propios de la aplicación
const APP_SHELL = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/img/car1.jpg',
    '/js/app.js'
];
//Todos aquellos recursos que nuncan cambian
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', e => {
    //console.log('Instalado');
    //e.skipWaiting();
    const staticCache = caches.open(STATIC).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const inmutableCache = caches.open(INMUTABLE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', e => {
    console.log('Activado');
});

self.addEventListener('fetch', e => {
    /*console.log(e.request);
    if(e.request.url.includes('car1.jpg'))
        e.respondWith(fetch('img/car2.jpg'))
    else e.respondWith(fetch(e.request))*/
//1. Cache Only
//e.respondWith(caches.match(e.request));

//2. Cache with network fallback
/*const source = caches.match(e.request).then(res => {
    if(res) return res;
    return fetch(e.request).then(resFetch => {
        caches.open(DYNAMIC).then(cache => {
            cache.put(e.request, resFetch);
        });
        return resFetch.clone();
    });
});
e.respondWith(source);*/

//3. Network with cache fallback
/*const source = fetch(e.request).then(res => {
    if(!res) throw Error('NotFound');
    //Checar si el recurso ya existe en algún cache
    caches.open(DYNAMIC).then(cache => {
        cache.put(e.request, res);
    });
    return res.clone();
}).catch(err=>{
    return caches.match(e.request);
});
e.respondWith(source);

//4. Cache with nerwork update
//Rendimiento crítico, si el rendimiento es bajo utilizar.
//Toda nuestra aplicación está a un paso atrás
if(e.request.url.includes('bootstrap'))
  return e.respondWith(caches.match(e.request));
const source = caches.open(STATIC).then(cache => {
    fetch(e.request).then(res => {
        cache.put(e.request, res);
    });
    return cache.match(e.request);
});
e.respondWith(source);
});

/*self.addEventListener('push', e => {
console.log('Notificacion push');
})

self.addEventListener('sync', e => {
console.log('SYNC EVENT');
})*/
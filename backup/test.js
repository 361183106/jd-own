function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('finish')
            resolve("sleep");
        }, 2000);
    });
}
async function test() {
    let value = await sleep();
    console.log("object");
}
test()









async function foo() {
    // 3
    console.log('fool')
}
async function bar(){
    // 2
    console.log('bar start')
    await foo()
    // 6
    console.log('bar end')
}

// 1
console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
},0)
bar()
new Promise(function(resolve,reject){
    // 4
    console.log('promise executor')
    resolve()
}).then(function(){
    // 7
    console.log('promise then')
})
// 5
console.log('script end')
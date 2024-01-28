function produceAfterDelay(result, delay) {
    return new Promise((resolve, reject) => {
    const callback = () => resolve(result)
    setTimeout(callback, delay)
    })
    }

    const result=produceAfterDealy("done?",2000);
    console.log("바로결과",result);

    console.log(result.then((res)=>console.log("then 함수 안의 결과",res)));
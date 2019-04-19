export function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
    var arr = [...arr];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let t = getRandom(0, i);
        let m = arr[t];
        arr[t] = arr[i];
        arr[i] = m;
    }
    return arr;
}

export   function un_insertionSort2(arr1,arr2){
    var len=arr1.length;
    for(var m=len-2;m>-1;m--){
        var key1=arr1[m],
            key2=arr2[m],
            n=m+1;
        while(arr1[n]>key1){
            arr1[n-1]=arr1[n];
            arr2[n-1]=arr2[n];
            n++;
        }
        arr1[n-1]=key1;
        arr2[n-1]=key2;
    }
    return [arr1,arr2]
}

export function filterArray(searchText, originArray, attribute) {
    if (searchText.trim() == "") {
        return originArray
    }
    else {
        return originArray.filter(item => {
            return item[attribute].toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1;
        })
    }

}
export function formateHot(x) {
    switch (true) {
        case x < 10000:
            return x;
            break;
        case x < 10000000:
            return (x / 10000).toFixed(1) + "万";
            break;
        default:
            return (x / 10000000).toFixed(1) + "千万";
            break;
    }
}

function r(x) {
    if (x < 10) {
        return "0" + x;
    }
    return x;
}
export function formateTime(total_s) {
    let m = Math.floor(total_s / 60);
    let s = Math.floor(total_s % 60);
    return `${r(m)}:${r(s)}`;
}
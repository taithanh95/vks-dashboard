export class WebUtilRemoveFisrtSpace {
  static itemSpace = '';

  static onHandle(value: string): string{
    this.onRemoveFirstSpace(value);
    const __res = this.itemSpace;
    this.itemSpace = null;
    return __res;
  }

  static onRemoveFirstSpace(value?: string) {
    if(value){
      const check = value.startsWith(" ");
      const check1 = value.startsWith("\n");
      if(check || check1) {
        const length = value.length;
        const subString = value.substr(1,length);
        this.onRemoveFirstSpace(subString);
      } else {
        this.itemSpace = value;
      }
    }
  }

}

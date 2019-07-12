export const fixClassName = oldClassName =>
	oldClassName
    .replace(
		 /\-+./gi,
		 x => x.substring(x.length-1).toUpperCase()
	 );

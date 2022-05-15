const specialChars = [
    '+', '-', '*', '/', '(', ')'
]

const arithFunctions = {
    '+': (...args: any) => {
        let value = 0;
        for(const i in args) {
            value += args[i];
        }

        return value;
    }
}

enum TokenTypes {
    Atom, // Everything that isn't a special character
    Special
}

export const parseText = (value: any) => {
    const tokens = tokenize(value.split(' '))
    const node = reassembleCalculation(tokens);
    return runNode(node).toString();
}

export const tokenize = (tokens: any) => {
    let parseableTokens = [];

    for(const token_index in tokens) {
        const tokenData = tokens[token_index];
        let parseableToken = {
            content: tokenData,
            type: TokenTypes.Atom
        };
        if(specialChars.includes(tokenData)) {
            parseableToken.type = TokenTypes.Special
        }

        parseableTokens.push(parseableToken);
    }

    return parseableTokens
}

export const reassembleCalculation = (tokens: any) => {
    let node = {
        action: null,
        operands: []
    }

    for(const tokenIndex in tokens) {
        const token = tokens[tokenIndex];
        if(token.type !== TokenTypes.Special) {
            // @ts-ignore
            node.operands.push(token.content);
        } else {
            node.action = token.content;
        }
    }

    return node;
}

export const runNode = (node: any) => {
    let result = '';

    if(Object.keys(arithFunctions).includes(node.action)) {
        let cleanOperands = [];
        for(const i in node.operands) {
            cleanOperands.push(parseFloat(node.operands[i]));
        }

        // @ts-ignore
        result = arithFunctions[node.action](...cleanOperands)
    }

    return result
}

export const parseParameters = (str: string) => {
    return str.split(",")
}

export const parseAction = (str: string) => {
    let tokens = str.split('');
    tokens = purgeExpr(parseExpr(tokens))

    return tokens
}

export const parseExpr = (tokens: any) => {
    let nodes: any = [];
    let index = 0;
    let potentialStr = '';

    for(; index < tokens.length; index++) {
        const character = tokens[index];

        if(character === "(") {
            let newNode = parseExpr(tokens.slice(index + 1));
            nodes.push(newNode);

            index += newNode.length + 1;
        } else if(character === ")") {
            return nodes;
        } else {
            if(specialChars.includes(character)) {
                nodes.push({
                    type: "SPECIAL",
                    value: character
                })
            } else {
                if(character !== " ")
                    potentialStr += character;
                
                if( tokens[index + 1] && (tokens[index + 1] === " " || specialChars.includes(tokens[index + 1])) ) {
                    nodes.push({
                        type: isNaN(parseFloat(potentialStr)) ? "VARIABLE" : "CONSTANT",
                        value: potentialStr
                    })

                    potentialStr = '';
                }
            }
        }
    }

    return nodes;
}

export const purgeExpr = (exp: any) => {
    let nodes: any = [];
    for(let i = 0; i < exp.length; i++) {
        if(exp[i].constructor === Array) {
            nodes.push([purgeExpr(exp[i])])
        } else {
            if(exp[i].value !== "") {
                nodes.push(exp[i])
            }
        }
    }

    return nodes
}
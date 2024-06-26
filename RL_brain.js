class RL{
    constructor(actions,learning_rate=0.9,reward_decay=0.9,e_greedy=0.9){
        this.actions=actions;
        this.lr=learning_rate;
        this.gamma=reward_decay;
        this.epsilon=e_greedy;
        this.q_table={};//Q表用对象表示
        this.i=0;
    }

    checkStateExist(state)
    {
        if(!this.q_table[state]){
        // 如果当前状态在Q表中不存在，将其加入Q表并为每个动作初始化一个0到2之间的随机值
        this.q_table[state]=Array.from({length:this.actions.length},() => Math.random() * 2);
        console.log(this.q_table[state]);
        }
    }
    //observation 某个状态state，0,1,2,3
    chooseAction(observation) {
        this.checkStateExist(observation); // 确保状态存在
        //从均匀分布的[0,1)中随机采样,当小于阈值时采用选择最优行为的方式,当大于阈值选择随机行为的方式
        
        if (Math.random() < this.epsilon) {
            // ε-greedy 策略选择动作
            const stateActionValues = this.q_table[observation];
            // 找出最大值
            const maxValue = Math.max(...stateActionValues);
            // 找出所有最大值的索引
            const maxIndexes = stateActionValues.reduce((indexes, currentValue, currentIndex) => {
                if (currentValue === maxValue) {
                    indexes.push(currentIndex);
                }
                return indexes;
            }, []);
        // 从最大值索引中随机选择一个
        const randomIndex = maxIndexes[Math.floor(Math.random() * maxIndexes.length)];
        return this.actions[randomIndex]; // 根据最大价值随机选择动作
        } else {
            // 随机选择动作
            const randomIndex = Math.floor(Math.random() * this.actions.length);
            return this.actions[randomIndex];
        }
    }
    //线性递减
    // updateEpsilon(currentEpisode) {
    //     //线性递减epsilon
    //     const initialEpsilon = this.epsilon; // 初始epsilon值0.9
    //     const minEpsilon = 0.01; // epsilon的最小值
    //     const decayRate = (initialEpsilon - minEpsilon) / 100; // 计算递减率
    //     this.epsilon = Math.max(0.1, initialEpsilon - decayRate * currentEpisode); // 更新epsilon值，确保不小于最小值
    // }    
}


class QLearningTable extends RL{
    constructor(actions,learning_rate,reward_decay,e_greedy){
        super(actions,learning_rate,reward_decay,e_greedy)
    }
    learn(s,a,r,s_){
        this.checkStateExist(s_);
        const qPredict=this.q_table[s][this.actions.indexOf(a)];
        const qTarget=s_!=='terminal'?
            r + this.gamma * Math.max(...Object.values(this.q_table[s_])) :
            r;
        this.q_table[s][this.actions.indexOf(a)]+=this.lr*(qTarget-qPredict)
    }
}

export {QLearningTable};

import { mapGetters, mapMutations, mapActions } from 'vuex'

export const float = {
    data() {
        return {
            float: false,
            float_message: "",
            float_time: 2000
        }
    },
    methods: {
        mixin_float(message) {
            if (this.float) {
                this.float = false;
                clearTimeout(this.float_timer);
            }
            this.float_message = message;
            this.float = true;
            this.float_timer = setTimeout(() => {
                this.float = false;
                this.float_message = "";
            }, this.float_time);

        }
    }
}



